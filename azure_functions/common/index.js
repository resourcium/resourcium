const config = require('./config');
require('isomorphic-fetch');

const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');
const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(config.VAULT_URL, credential);
const { CosmosClient } = require('@azure/cosmos');

async function getSecret(name) {
  const secret = (await secretClient.getSecret(name))['value'];

  return secret;
}

async function getCosmosDb() {
  const connectionString = await getSecret('cosmosconnection');

  return new CosmosClient(connectionString).database('main');
}

async function getAppAccessToken() {
  const secret = await getSecret('azurefunctionsecret');

  const body = `client_id=${config.APP_CLIENT_ID}&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default\
&client_secret=${secret}\
&grant_type=client_credentials`;

  const res = await fetch(
    `https://login.microsoftonline.com/${config.TENANT}/oauth2/v2.0/token`,
    {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const resJSON = await res.json();

  return resJSON['access_token'];
}

function BadRequest(context, msg) {
  context.res = {
    status: 403,
    body: JSON.stringify({ error_code: 'BAD_REQUEST', error: msg }),
  };
}

async function hasUserAlreadySetup2fa(container, userID) {
  const item = await container.item(userID).read();

  return (
    item.statusCode != 404 &&
    item.resource &&
    item.resource.secret &&
    item.resource.has_verified
  );
}

module.exports = {
  getSecret,
  getAppAccessToken,
  config,
  BadRequest,
  getCosmosDb,
  hasUserAlreadySetup2fa,
  secretClient,
};
