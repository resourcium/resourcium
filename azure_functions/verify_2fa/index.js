const graph = require('@microsoft/microsoft-graph-client');
const speakeasy = require('speakeasy');

const { config, BadRequest, getCosmosDb } = require('../common');

module.exports = async function (context, req) {
  if (!req.body || !req.body.accessToken) {
    BadRequest(context, 'You must supply the access token');
    return;
  }

  if (!req.body.totpToken) {
    BadRequest(context, 'You must supply the totp token');
    return;
  }

  const accessToken = req.body.accessToken;
  const totpToken = req.body.totpToken;

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
  const { resource: item } = await container.item(userID).read();

  if (!item || !item.secret) {
    BadRequest(context, 'User has not registered');
    return;
  }

  if (item.has_verified) {
    BadRequest(context, 'User has already verified');
    return;
  }

  const secret = item.secret;

  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: totpToken,
  });

  if (verified) {
    const responseMessage = {
      success: true,
      message: 'The token was valid',
    };

    item.has_verified = true;
    await container.items.upsert(item);

    context.res = {
      status: 200,
      body: JSON.stringify(responseMessage),
    };
  } else {
    const responseMessage = {
      error_code: 'BAD_TOTP_TOKEN',
      error:
        'The second factor token you provided is invalid, please check and try again.',
    };

    context.res = {
      status: 403,
      body: JSON.stringify(responseMessage),
    };
  }
};
