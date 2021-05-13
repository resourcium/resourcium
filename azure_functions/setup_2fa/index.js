const graph = require('@microsoft/microsoft-graph-client');
const speakeasy = require('speakeasy');

const {
  config,
  BadRequest,
  getCosmosDb,
  hasUserAlreadySetup2fa,
} = require('../common');

module.exports = async function (context, req) {
  if (!req.body || !req.body.accessToken) {
    BadRequest(context, 'You must supply the access token');
    return;
  }

  const accessToken = req.body.accessToken;
  const graphUserClient = graph.Client.init({
    authProvider: cb => cb(null, accessToken),
  });

  let userDetails;
  try {
    userDetails = await graphUserClient.api('/me').select('id').get();
  } catch (e) {
    BadRequest(context, 'Invalid auth token');
    return;
  }
  const userID = userDetails['id'];

  const container = (await getCosmosDb()).container(config.CONTAINER_SECRETS);

  // User already has a 2fa secret, they are not allowed to re-register (that would defeat the point of 2fa)
  if (await hasUserAlreadySetup2fa(container, userID)) {
    BadRequest(context, 'User has already registered');
    return;
  }

  var secret = speakeasy.generateSecret({ length: 16 });

  // Upsert not create because there's a chance that a user started the process but
  // never verifed
  await container.items.upsert({
    id: userID,
    secret: secret.base32,
    has_verified: false,
  });

  const responseMessage = {
    success: true,
    totp_secret: secret.base32,
    totp_url: secret.otpauth_url,
  };

  context.res = {
    status: 200,
    body: JSON.stringify(responseMessage),
  };
};
