const graph = require('@microsoft/microsoft-graph-client');

const { BadRequest, config, secretClient, getSecret } = require('../common');

const { LINKEDIN_LEARNING_SECRET_NAME } = config;

async function getNewAccessToken() {
  var details = {
    grant_type: 'client_credentials',
    client_id: config.LINKEDIN_LEARNING.client_id,
    client_secret: config.LINKEDIN_LEARNING.client_secret,
  };

  var formBody = [];
  for (var prop in details) {
    var encKey = encodeURIComponent(prop);
    var encValue = encodeURIComponent(details[prop]);
    formBody.push(encKey + '=' + encValue);
  }
  formBody = formBody.join('&');

  const response = await fetch(
    'https://www.linkedin.com/oauth/v2/accessToken',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    }
  );

  return (await response.json()).access_token;
}

// Stores the provided access token in the vault for future use
async function updateAccessToken(accessToken) {
  await secretClient.setSecret(LINKEDIN_LEARNING_SECRET_NAME, accessToken);
}

async function getAssets(user_inp, access_token) {
  const bearer = 'Bearer  ' + access_token;
  const response = await fetch(
    'https://api.linkedin.com/v2/learningAssets?q=criteria&' +
      'assetFilteringCriteria.keyword=' +
      encodeURIComponent(user_inp) +
      '&count=20' +
      '&assetFilteringCriteria.locales[0].language=en' +
      '&assetFilteringCriteria.licensedOnly=true',
    {
      method: 'GET',
      headers: {
        Authorization: bearer,
      },
    }
  );

  return response;
}

module.exports = async function (context, req) {
  if (!req.body || !req.body.accessToken || !req.body.query) {
    BadRequest(context, 'You must supply the access token');
    return;
  }

  const graphUserClient = graph.Client.init({
    authProvider: cb => cb(null, req.body.accessToken),
  });

  const userDetails = await graphUserClient.api('/me').select('id').get();
  const userID = userDetails['id'];

  if (!userID) {
    BadRequest(context, 'Invalid User');
    return;
  }

  let accessToken = await getSecret(LINKEDIN_LEARNING_SECRET_NAME);
  let tokenUpdate = false;

  if (!accessToken) {
    accessToken = await getNewAccessToken();
    tokenUpdate = true;
  }

  let response = await getAssets(req.body.query, accessToken);
  if (response.status == 401) {
    accessToken = await getNewAccessToken();
    tokenUpdate = true;

    response = await getAssets(req.body.query, accessToken);

    if (response.status != 200) {
      context.res = {
        status: 500,
      };
      return;
    }
  }

  if (tokenUpdate) {
    await updateAccessToken(accessToken);
  }

  const assets = await response.json();

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(assets.elements),
  };
};
