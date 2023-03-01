# configure the S3 backend for storing state. This allows different
# team members to control and update terraform state.
terraform {
  backend "s3" {
    # This must be updated for each unique deployment/stage!
    # should  be of the form services/APP_NAME/STAGE/terraform.tfstate
    # We can't use variables in the key name here, so we need to be extra
    # careful with this!
    key    = "services/hitide/terraform.tfstate"
    region = "us-west-2"
  }
}

provider "aws" {
  version                 = "~> 3.27"
  region                  = "us-west-2"
  shared_credentials_file = var.credentials
  profile                 = var.profile

  ignore_tags {
    key_prefixes = ["gsfc-ngap"]
  }
}

data "aws_caller_identity" "current" {}

locals {
  name        = var.app_name
  environment = var.stage

  # This is the convention we use to know what belongs to each other
  ec2_resources_name = terraform.workspace == "default" ? "podaac-services-${local.environment}-${local.name}" : "podaac-services-${local.environment}-${local.name}-${terraform.workspace}"

  # Account ID used for getting the ECR host
  account_id = data.aws_caller_identity.current.account_id

  default_tags = length(var.default_tags) == 0 ? {
    team : "TVA",
    application : local.ec2_resources_name,
    Environment = var.stage
    Version     = var.app_version
  } : var.default_tags
}