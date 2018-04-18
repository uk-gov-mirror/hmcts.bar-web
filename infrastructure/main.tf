provider "vault" {
  // # tactical vault - for example: use `data "vault_generic_secret" "s2s_secret" {`
  address = "https://vault.reform.hmcts.net:6200"
}

data "vault_generic_secret" "client_secret" {
  path = "secret/${var.vault_section}/ccidam/service-auth-provider/api/microservice-keys/bar"
}

module "bar-web" {
  source   = "git@github.com:hmcts/moj-module-webapp?ref=master"
  product  = "${var.product}-web"
  location = "${var.location}"
  env      = "${var.env}"
  ilbIp    = "${var.ilbIp}"
  subscription = "${var.subscription}"
  is_frontend  = true
  additional_host_name = "${var.external_host_name}"
  https_only = "true"

  app_settings = {
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    BAR_API_URL = "http://bar-api-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"

    IDAM_CLIENT_SECRET = "${data.vault_generic_secret.client_secret.data["value"]}"

    NODE_ENV = "production"
    # temporary variable to ignore certs loading in start.js as it's handled at IIS server level
    IGNORE_CERTS = "true"
  }
}
