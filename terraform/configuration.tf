terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "2.40.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# To avoid conflict with other cloud users which use the same name for various resources
# we generate some random bytes which we use to modify the name of our resources.
# It may only be storage account that needs to be unique
resource "random_id" "generic" {
  byte_length = 8
}


data "azurerm_client_config" "current" {
}

resource "azurerm_resource_group" "team29app" {
  name     = "team29${random_id.generic.hex}"
  location = "uksouth"
}

resource "azurerm_storage_account" "team29app" {
  name                     = "team29${random_id.generic.hex}"
  resource_group_name      = azurerm_resource_group.team29app.name
  location                 = azurerm_resource_group.team29app.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document = "index.html"
    error_404_document = "index.html"
  }
}

resource "azuread_application" "team29app" {
  display_name               = "team29app"
  # Consider changing this to false and fixing the login code
  available_to_other_tenants = true
  reply_urls = [
    # For development
    "http://localhost:3000",
    azurerm_storage_account.team29app.primary_web_endpoint
  ]
  oauth2_allow_implicit_flow = true
}

resource "azurerm_app_service_plan" "team29app" {
  name                = "azure-functions-service-plan"
  location            = azurerm_resource_group.team29app.location
  resource_group_name = azurerm_resource_group.team29app.name
  kind                = "FunctionApp"

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "team29app" {
  name                       = "team29${random_id.generic.hex}"
  location                   = azurerm_resource_group.team29app.location
  resource_group_name        = azurerm_resource_group.team29app.name
  app_service_plan_id        = azurerm_app_service_plan.team29app.id
  storage_account_name       = azurerm_storage_account.team29app.name
  storage_account_access_key = azurerm_storage_account.team29app.primary_access_key

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME = "node"
    WEBSITE_NODE_DEFAULT_VERSION = "~12"
    WEBSITE_RUN_FROM_PACKAGE = "1"
  }

  site_config {
    cors {
      allowed_origins = ["*"]
    }
  }

  identity {
    type = "SystemAssigned"
  }

  version = "~3"
}


resource "random_password" "password" {
  length = 26
  special = true
}


resource "azuread_application_password" "functionsecret" {
  application_object_id = azuread_application.team29app.id
  description           = "Function application password"
  value                 = random_password.password.result
  end_date              = "2099-01-01T01:02:03Z"
}

resource "azurerm_key_vault" "team29app" {
  name                = "team29${random_id.generic.hex}"
  location            = azurerm_resource_group.team29app.location
  resource_group_name = azurerm_resource_group.team29app.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_function_app.team29app.identity[0].principal_id

    secret_permissions = [
      "Get",
      "Set"
    ]
  }

  # Useful for development (let's current user access secrets)
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "set",
      "get",
      "list",
      "delete"
    ]
  }
}

resource "azurerm_key_vault_secret" "functionsecret" {
  name         = "azurefunctionsecret"
  value        = random_password.password.result
  key_vault_id = azurerm_key_vault.team29app.id
}

resource "azurerm_key_vault_secret" "linkedin" {
  name         = "linkedin-learning"
  value        = ""
  key_vault_id = azurerm_key_vault.team29app.id
}

resource "azurerm_cosmosdb_account" "acc" {
  name = "team29${random_id.generic.hex}"
  location = azurerm_resource_group.team29app.location
  resource_group_name = azurerm_resource_group.team29app.name
  offer_type = "Standard"
  kind = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location = azurerm_resource_group.team29app.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name = "main"
  resource_group_name = azurerm_cosmosdb_account.acc.resource_group_name
  account_name = azurerm_cosmosdb_account.acc.name
}

resource "azurerm_cosmosdb_sql_container" "registration" {
  name = "registration_secret"
  resource_group_name = azurerm_cosmosdb_account.acc.resource_group_name
  account_name = azurerm_cosmosdb_account.acc.name
  database_name = azurerm_cosmosdb_sql_database.db.name
}

resource "azurerm_cosmosdb_sql_container" "settings" {
  name = "settings"
  resource_group_name = azurerm_cosmosdb_account.acc.resource_group_name
  account_name = azurerm_cosmosdb_account.acc.name
  database_name = azurerm_cosmosdb_sql_database.db.name
}

resource "azurerm_key_vault_secret" "connectionstring" {
  name         = "cosmosconnection"
  value        = "AccountEndpoint=${azurerm_cosmosdb_account.acc.endpoint};AccountKey=${azurerm_cosmosdb_account.acc.primary_key};"
  key_vault_id = azurerm_key_vault.team29app.id
}

output "tenant_id" {
  value = data.azurerm_client_config.current.tenant_id
}

output "app_id" {
  value = azuread_application.team29app.application_id
}

output "functions_name" {
  value = azurerm_function_app.team29app.name
}

output "functions_url" {
  value = azurerm_function_app.team29app.default_hostname
}

output "vault_url" {
  value = azurerm_key_vault.team29app.vault_uri
}

output "storage_account" {
  value = azurerm_storage_account.team29app.name
}

output "client_url" {
  value = azurerm_storage_account.team29app.primary_web_endpoint
}

output "test" {
  value = azurerm_function_app.team29app.identity[0].principal_id
}
