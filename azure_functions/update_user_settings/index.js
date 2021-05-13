const graph = require('@microsoft/microsoft-graph-client');

const { config, BadRequest, getCosmosDb } = require('../common');

module.exports = async function (context, req) {
  if (!req.body || !req.body.accessToken || !req.body.newSettings) {
    BadRequest(context, 'You must supply the access token and new settings');
    return;
  }

  // This should be a JSON encoded string
  const newSettings = req.body.newSettings;

  const accessToken = req.body.accessToken;
  const graphUserClient = graph.Client.init({
    authProvider: cb => cb(null, accessToken),
  });

  let userDetails;
  try {
    userDetails = await graphUserClient.api('/me').select('id').get();
  } catch (e) {
    console.log('Error getting user info', e);
    BadRequest(context, 'Invalid auth token');
    return;
  }

  const userID = userDetails['id'];
  const container = (await getCosmosDb()).container(config.CONTAINER_SETTINGS);

  await container.items.upsert({
    id: userID,
    settings: newSettings,
  });

  const responseMessage = {
    success: true,
    newSettings,
  };

  context.res = {
    status: 200,
    body: JSON.stringify(responseMessage),
  };
};
