provider "github" {
  token = var.github_token
}

resource "github_actions_workflow" "ci_cd_pipeline" {
  name        = "CI/CD Pipeline"
  path        = ".github/workflows/ci-cd.yml"
  content     = filebase64(".github/workflows/ci-cd.yml")
}

resource "github_actions_secret" "github_token" {
  name        = "GITHUB_TOKEN"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "aws_access_key_id" {
  name        = "AWS_ACCESS_KEY_ID"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "aws_secret_access_key" {
  name        = "AWS_SECRET_ACCESS_KEY"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "dockerhub_username" {
  name        = "DOCKERHUB_USERNAME"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "dockerhub_password" {
  name        = "DOCKERHUB_PASSWORD"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "redis_password" {
  name        = "REDIS_PASSWORD"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "database_password" {
  name        = "DATABASE_PASSWORD"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "jwt_secret" {
  name        = "JWT_SECRET"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "google_analytics_key" {
  name        = "GOOGLE_ANALYTICS_KEY"
  repository  = var.repository
  environment = "PROTECTED"
}

resource "github_actions_secret" "google_analytics_id" {
  name        = "GOOGLE_ANALYTICS_ID"
  repository  = var.repository
  environment = "PROTECTED"
}