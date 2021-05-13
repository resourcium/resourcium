const deployConfig = require('../' +
    (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'|| process.env.NODE_ENV === 'test'
        ? 'devDeployConfig.json'
        : 'deployConfig.json'));

export const AZURE_DETAILS = {
    appId: deployConfig['app_id'],
    scopes: ['user.read', 'calendars.read'],
};

export const defaultUserSettings = {
    twitter: true,
    twitch: '',
    darkmode: false,
    squiggle: 'E67E22',
};

export const BASE_URL = process.env.REACT_APP_USE_LOCAL_FUNCTIONS
    ? 'http://localhost:7071/api/'
    : `https://${deployConfig['functions_url']}/api/`;

export const QNA_BOT_TOKEN = deployConfig['qna_bot_token'];

export const USEFUL_LINKS = deployConfig['useful_links'];
export const WELLBEING_LINKS = deployConfig['wellbeing_links'];

export const TWITTER_FEED_URL = deployConfig['twitter_feed'];

