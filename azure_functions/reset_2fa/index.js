const graph = require('@microsoft/microsoft-graph-client');

const { config, BadRequest, getCosmosDb } = require('../common');

module.exports = async function (context, req) {
  console.log(process.env.ALLOW_RESET_2FA, process.env.NODE_ENV);
  if (
    !config.ALLOW_RESET_2FA &&
    (!process.env.ALLOW_RESET_2FA || process.env.NODE_ENV == 'production')
  ) {
    BadRequest(context, 'This is not enabled in production');
    return;
  }

  if (!req.body || !req.body.accessToken) {
    BadRequest(context, 'You must supply the access token');
    return;
  }

  const accessToken = req.body.accessToken;
  const graphUserClient = graph.Client.init({
    authProvider: cb => cb(null, accessToken),
  });

  const userDetails = await graphUserClient.api('/me').select('id').get();
  const userID = userDetails['id'];

  const container = (await getCosmosDb()).container(config.CONTAINER_SECRETS);

  await container.item(userID).delete();

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: '',
  };
};
