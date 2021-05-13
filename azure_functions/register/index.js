const graph = require('@microsoft/microsoft-graph-client');
const speakeasy = require('speakeasy');

const {
  config,
  BadRequest,
  getCosmosDb,
  hasUserAlreadySetup2fa,
} = require('../common');

async function submitAttendenceToOrca(studentDetails) {
  const student = {
    id: studentDetails.id,
    firstname: studentDetails.firstname,
    lastname: studentDetails.lastname,
    email: studentDetails.email,
  };

  const timestamp = new Date().toISOString();

  const res = await fetch(config.ORCA.url + `?apiKey=${config.ORCA.secret}`, {
    method: 'POST',
    body: JSON.stringify({
      student,
      timestamp,
    }),
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  });

  return res;
}

module.exports = async function (context, req) {
  if (!req.body || !req.body.accessToken) {
    BadRequest(context, 'You must supply the access token');
    return;
  }

  if (!req.body || !req.body.totpToken) {
    BadRequest(context, 'You must supply the totp token');
    return;
  }

  const accessToken = req.body.accessToken;
  const graphUserClient = graph.Client.init({
    authProvider: cb => cb(null, accessToken),
  });

  const totpToken = req.body.totpToken;

  let userDetails;
  try {
    userDetails = await graphUserClient.api('/me').get();
  } catch (e) {
    console.log('Error getting user info', e);
    BadRequest(context, 'Invalid auth token');
    return;
  }
  const userID = userDetails['id'];

  const container = (await getCosmosDb()).container(config.CONTAINER_SECRETS);
  const { resource: item } = await container.item(userID).read();

  // Ensure that the user has a 2fa secret
  if (!(await hasUserAlreadySetup2fa(container, userID))) {
    BadRequest(context, 'User has not registered 2fa');
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

    const orcaRes = await submitAttendenceToOrca(userDetails);

    if (orcaRes.status == 200) {
      context.res = {
        status: 200,
        body: JSON.stringify(responseMessage),
      };
    } else {
      console.log('Error from ORCA', orcaRes);

      context.res = {
        status: 500,
      };
    }
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
