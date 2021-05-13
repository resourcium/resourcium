const DEPLOY_CONFIG = require('../deployConfig.json');

const TENANT = DEPLOY_CONFIG['tenant_id'];
const APP_CLIENT_ID = DEPLOY_CONFIG['app_id'];
const VAULT_URL = DEPLOY_CONFIG['vault_url'];

const ORCA = DEPLOY_CONFIG['orca'];
const LINKEDIN_LEARNING = DEPLOY_CONFIG['linkedin_learning'];

const ALLOW_RESET_2FA = DEPLOY_CONFIG['allow_reset_2fa'];

// The names of the containers
const CONTAINER_SECRETS = 'registration_secret';
const CONTAINER_SETTINGS = 'settings';

const LINKEDIN_LEARNING_SECRET_NAME = 'linkedin-learning';

module.exports = {
  TENANT,
  APP_CLIENT_ID,
  VAULT_URL,
  CONTAINER_SECRETS,
  CONTAINER_SETTINGS,
  LINKEDIN_LEARNING,
  ORCA,
  LINKEDIN_LEARNING_SECRET_NAME,
  ALLOW_RESET_2FA,
};
