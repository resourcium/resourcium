# Team29 Deployment Guide

## Introduction

Our system is split into two distinct halves. One is the app which includes the react front-end and the Azure function back end, the deployment for which is nearly entirely automated by scripts in the `deploy` folder. The other is the Sharepoint side of our project for which automatic deployment is not possible. TODO: the "Sharepoint" deployment isn't just sharepoint and some of it is automated, this sentence should be fixed.



## I - The Sharepoint deployment 

The Sharepoint deployment must happen before the app deployment as the app depends on URLs from the Sharepoint deployment. Below is the guide for SharePoint deployment:
[Deployment Guide](https://sites.google.com/view/team29deploymentguide/home)


## II - The app deployment

### Dependencies

- You must have a copy of the source code for our app.
- You must have access to a POSIX shell such as bash or zsh (this is not a requirement of the code but the specific steps and commands are different for example in Powershell, you may use other shells if you are experienced enough in them). On Linux of MacOS you can use your default shell, on Windows you should install WSL (Windows Subsystem for Linux). 
- You must have `python` version 3 installed.
- Install [`virtualenv`](https://virtualenv.pypa.io/en/latest/installation.html) (You can run `pip install virtualenv`, you must ensure that this is the `pip` for python3).
- Install [`nodejs`](https://nodejs.org/en/download/) (which should come with `npm`) for you system. Make sure you install a recent LTS version.
- Install [`terraform`](https://www.terraform.io/downloads.html) (a tested version is `0.14`).
- Install [Azure CLI tools](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).
- Install [Azure function core tools](https://github.com/Azure/azure-functions-core-tools), you can do this by running `npm i -g azure-functions-core-tools@3 --unsafe-perm true` (`npm` should be installed when you installed node). You must install version 3.
- Run `az login` then login with the account that you want to deploy with (this account will own all the resources).
- (Optional) if you want to choose a specific subscription to run the deployment on: `az account set --subscription <subscription-id>`.

### App configuration

The deployment of the app is configured using a file called `app_config.yaml`. It is configured so that it will not be stored in the `git` history as it may contain sensitive information. An example is found at `app_config.yaml.example`. You should copy this file and rename the copy to `app_config.yaml`. It must be stored in the root of the project. The example file is self documented.

### Deploy script

The next commands assume that you have a shell open in the `deploy` directory.

Before you begin the deployment script you must first setup the environment by running the `setup_env.sh` script. This will install the python dependencies for the script. To run the script you can run `sh setup_env.sh` or `./setup_env.sh`. Once that's done you can enter the python virtual environment by running `source env/bin/activate` (NOTE: you can skip entering the virtualenv if `pyyaml` is installed globally, but this it not recommended).

You are now ready to run `python deploy.py` (again assuming that python3 is installed as `python`).

It will first check all the dependencies telling you if you need to install anything or run any commands. If everything is ready to go it will print out your deploy config and the subscription that it's going to deploy to, if it looks good you can type `y` and then hit enter.

The deployment of azure resources can take a very long time (sometimes multiple hours) so you need to be patient. You may be asked for confirmation later on, usually you can just accept.

### Post deployment

At the end of the deployment you are given the deployed URL of the app (future developers extending our app will allow for custom URLs to be given rather than long auto-generated ones).

You should create backups of the `app_config.yaml` file in the root and the file `terraform.tfstate` in the `terraform` folder. Both these files are hidden from the git history and both contain sensitive data and they are all that is required (apart from the source code) for redeployment/upgrades. If you do not save the `terraform.tfstate` and the app is updated you will have to create a new instance of the app (it will **not** update the old version).

At any time you are able to re-download our source code and then place `app_config.yaml` and `terraform.tfstate` in the correct locations and everything will work fine.
