import subprocess
import os
import json
import sys

import yaml

PROJECT_ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir))
APP_CONFIG_PATH=os.path.join(PROJECT_ROOT, 'app_config.yaml')
APP_CONFIG=None
TERRAFORM_DIR=os.path.join(PROJECT_ROOT, 'terraform')
TERRAFORM_OUTPUT=None

CLIENT_ROOT=os.path.join(PROJECT_ROOT, 'client_web')
SERVER_ROOT=os.path.join(PROJECT_ROOT, 'azure_functions')

CLIENT_DEPLOY_CONFIG_PATH=os.path.join(CLIENT_ROOT, 'src', 'deployConfig.json')
SERVER_DEPLOY_CONFIG_PATH=os.path.join(SERVER_ROOT, 'deployConfig.json')

def print_stage_message(msg):
    print('=' * (len(msg) + 8))
    print('=== ' + msg + ' ===')
    print('=' * (len(msg) + 8))

def run_cmd(cmd, cwd=None):
    result = subprocess.run(cmd, capture_output=True, cwd=cwd)
    return result

def check_command_works(cmd, cwd=None):
    try:
        result = run_cmd(cmd, cwd=cwd)
        return result.returncode == 0
    except FileNotFoundError as e:
        return False

def check_terraform():
    if not check_command_works(["terraform", "--version"]):
        print('ERROR running `terraform --version`, please make sure that terraform is installed')
        return False

    if not check_command_works(["terraform", "init"], cwd=TERRAFORM_DIR):
        print('ERROR running `terraform init`')
        return False

    if not check_command_works(["terraform", "validate"], cwd=TERRAFORM_DIR):
        print('ERROR running `terraform validate`, you may need to contact the developers of this app as this indicates an issue with the terraform source file')
        return False

    result = run_cmd(["terraform", "show", "-json"], cwd=TERRAFORM_DIR)
    if result.returncode != 0:
        print('ERROR running `terraform show`')
        return False

    state = json.loads(str(result.stdout, 'utf-8'))
    if not 'values' in state:
        print('WARNING `terraform show` showed there was no pre-existing state.')
        print('        This is correct if this is the first time you are deploying.')
        print('        If you have previously deployed make sure you copy your state')
        print('        files into the `terraform` directory.')

    return True

def check_npm():
    if not check_command_works(["npm", "--version"]):
        print('ERROR running `npm --version`, please make sure that npm is installed (this can be achieved by installing node lts)')
        return False

    return True

def check_az():
    if not check_command_works(["az", "--version"]):
        print('ERROR running `az --version`, please make sure that az is installed (look for azure dev tools)')
        return False

    result = run_cmd(["az", "account", "list"])
    if result.returncode != 0:
        print('ERROR running `az account list`, please make sure that you have run `az login`')
        return False

    accounts = json.loads(str(result.stdout, 'utf-8'))
    default_account = next((account for account in accounts if account['isDefault']), None)

    if default_account == None:
        print('ERROR no default account was found when running `az account list`, please make sure that you have a subscription')
        return False

    print('Found the default azure subscription for the user (hint run `az account set --subscription <subscription-id>` to change it)\n' + json.dumps(default_account, indent=1))

    if default_account['state'] != 'Enabled':
        print('ERROR the default account was not enabled when running `az account list`, please make sure that you have a valid subscription')
        return False

    return True

def check_func():
    if not check_command_works(["func", "--version"]):
        print('ERROR running `func --version`, please make sure that func is installed (look for azure dev tools)')
        return False

    return True

def check_app_config():
    global APP_CONFIG
    if not os.path.exists(APP_CONFIG_PATH):
        print('ERROR app config does not exist at path `{}`'.format(APP_CONFIG_PATH))
        return False

    with open(APP_CONFIG_PATH, "r") as f:
        try:
            APP_CONFIG = yaml.load(f, Loader=yaml.FullLoader)
        except JSONDecodeError as e:
            print('ERROR app config at `{}` was not valid yaml {}'.format(APP_CONFIG_PATH, e))
            return False
        except Exception as e:
            print('ERROR reading and parsing app config at `{}`: {}'.format(APP_CONFIG_PATH, e))
            return False

    # TODO: Check fields in APP_CONFIG

    print('Using app config:\n=====(config start)\n'
            + yaml.dump(APP_CONFIG)
            + '\n=====(config end)')

    return True

def run_terraform_deployment():
    global TERRAFORM_OUTPUT
    print_stage_message('Beginning terraform deploy (this may take a while)')
    result = subprocess.run(["terraform", "apply"], cwd=TERRAFORM_DIR)
    if result.returncode != 0:
        print('ERROR running `terraform apply`')
        return False


    result = run_cmd(["terraform", "output", "-json"], cwd=TERRAFORM_DIR)
    if result.returncode != 0:
        print('ERROR running `terraform output -json`')
        return False

    TERRAFORM_OUTPUT = {key: val['value'] for (key, val) in json.loads(str(result.stdout, 'utf-8')).items() }

    return True

def check_depenencies():
    print_stage_message('Setting things up and checking depenencies')
    dependencies = [('terraform', check_terraform), ('npm_node', check_npm), ('az', check_az), ('func', check_func), ('app_config', check_app_config)]

    errors = [name for (name, f) in dependencies if not f()]

    if len(errors) > 0:
        print_stage_message('Dependency check failed, {} errors:'.format(len(errors)))
        print('Failed checks (see above output for more details):\n' + '\n'.join([(' - ' + error) for error in errors]))
        return False

    return True

def generate_client_deploy_config():
    global APP_CONFIG, TERRAFORM_OUTPUT
    config = {
        "default_user_settings": APP_CONFIG['DEFAULT_USER_SETTINGS'],
        "app_title": APP_CONFIG['APP_TITLE'],
        "twitter_feed": APP_CONFIG['HOME_TWITTER_FEED'],
        "useful_links": APP_CONFIG['USEFUL_LINKS'],
        "wellbeing_links": APP_CONFIG['WELLBEING_LINKS'],
        "tenant_id": TERRAFORM_OUTPUT['tenant_id'],
        "app_id": TERRAFORM_OUTPUT['app_id'],
        "functions_url": TERRAFORM_OUTPUT['functions_url'],
        "qna_bot_token": APP_CONFIG["QNA_BOT_TOKEN"]
    }

    with open(CLIENT_DEPLOY_CONFIG_PATH, 'w') as f:
        f.write(json.dumps(config, indent=2))
    print('Generated', CLIENT_DEPLOY_CONFIG_PATH)

def generate_server_deploy_config():
    global APP_CONFIG, TERRAFORM_OUTPUT
    config = {
        "orca": APP_CONFIG['ORCA'],
        "linkedin_learning": APP_CONFIG['LINKEDIN_LEARNING'],
        "tenant_id": TERRAFORM_OUTPUT['tenant_id'],
        "app_id": TERRAFORM_OUTPUT['app_id'],
        "allow_reset_2fa": APP_CONFIG['ALLOW_RESET_2FA'],
        "vault_url": TERRAFORM_OUTPUT['vault_url']
    }

    with open(SERVER_DEPLOY_CONFIG_PATH, 'w') as f:
        f.write(json.dumps(config, indent=2))
    print('Generated', SERVER_DEPLOY_CONFIG_PATH)

def generate_deploy_configs():
    print_stage_message('Generating deploy config files')
    print("")
    generate_client_deploy_config()
    generate_server_deploy_config()
    print("")

def npm_install(path):
    result = subprocess.run(["npm", "install"], cwd=path)
    if result.returncode != 0:
        print('Failed to install npm packages in {}, check that the node version is LTS'.format(path))
        return False

    return True

def deploy_azure_functions(function_name):
    print_stage_message('Deploying azure functions')

    if not npm_install(SERVER_ROOT):
        sys.exit(1)

    result = subprocess.run(["func", "azure", "functionapp", "publish", function_name, "--javascript"], cwd=SERVER_ROOT)
    if result.returncode != 0:
        print('Failed to publish azure functions to {}'.format(function_name))
        sys.exit(1)

    print('Deployed azure function to', function_name)


def deploy_client_web(storage_account_name, client_url):
    print_stage_message('Deploying app front end')

    if not npm_install(CLIENT_ROOT):
        sys.exit(1)

    result = subprocess.run(["npm", "run", "build"], cwd=CLIENT_ROOT)
    if result.returncode != 0:
        print('Failed to build front end')
        sys.exit(1)

    result = subprocess.run(["az", "storage", "blob", "upload-batch", "-s", "build", "-d", "$web", "--account-name", storage_account_name], cwd=CLIENT_ROOT)
    if result.returncode != 0:
        print('Failed to upload front end to {}'.format(storage_account_name))
        sys.exit(1)

    print('Deployed app front end to', client_url)


if __name__ == '__main__':
    if not check_depenencies():
        sys.exit(1)

    print('Please check the output above (in detail) to ensure everything looks correct.')
    print('If there are any warnings make sure you understand them.')
    if not input('Does the above output look correct? [y/n] ') == 'y':
        print('Stopped deployment (user request)')
        sys.exit(1)

    if not run_terraform_deployment():
        sys.exit(1)

    generate_deploy_configs()

    deploy_client_web(TERRAFORM_OUTPUT['storage_account'], TERRAFORM_OUTPUT['client_url'])
    deploy_azure_functions(TERRAFORM_OUTPUT['functions_name'])

    print_stage_message("Finished")

    print("\nYou can view the live version of the app here: " + TERRAFORM_OUTPUT['client_url'])
