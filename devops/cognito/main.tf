resource "aws_cognito_user_pool" "cognito_pool" {
  name = "cognito-example-user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
  }
}

resource "aws_cognito_user_pool_client" "cognito_pool_client" {
  name                         = "cognito-client"
  user_pool_id                 = aws_cognito_user_pool.cognito_pool.id
  generate_secret              = true
  supported_identity_providers = ["COGNITO"]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = [
    "code"
  ]
  allowed_oauth_scopes = ["email", "openid", "phone"]

  explicit_auth_flows = [
    "ALLOW_USER_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  callback_urls = [
    "http://localhost:8080"
  ]

  logout_urls = [
    "http://localhost:8080/logout",
  ]

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 5

  enable_token_revocation       = true
  prevent_user_existence_errors = "ENABLED"
}

resource "aws_cognito_user_pool_domain" "cognito_domain" {
  domain       = "user-pool-domain-yz"
  user_pool_id = aws_cognito_user_pool.cognito_pool.id
}

resource "null_resource" "cognito_dependency" {
  depends_on = [
    aws_cognito_user_pool.cognito_pool,
    aws_cognito_user_pool_client.cognito_pool_client,
    aws_cognito_user_pool_domain.cognito_domain
  ]
}

resource "aws_cognito_user" "default_user" {
  user_pool_id = aws_cognito_user_pool.cognito_pool.id
  username     = "user@example.com"
  attributes = {
    email = "user@example.com"
  }

  force_alias_creation = false
  message_action       = "SUPPRESS" # Prevents sending a signup email

  depends_on = [
    aws_cognito_user_pool.cognito_pool
  ]
}

resource "null_resource" "set_default_user_password" {
  provisioner "local-exec" {
    command = <<EOT
      aws cognito-idp admin-set-user-password \
        --region ${var.AWS_REGION} \
        --user-pool-id ${aws_cognito_user_pool.cognito_pool.id} \
        --username user@example.com \
        --password "P@ssw0rd123!" \
        --permanent
    EOT
  }

  depends_on = [
    aws_cognito_user.default_user
  ]
}
