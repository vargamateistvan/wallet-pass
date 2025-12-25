output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.backend.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.backend.arn
}

output "backend_url" {
  description = "Backend API URL"
  value       = aws_apigatewayv2_stage.backend.invoke_url
}

output "function_url" {
  description = "Lambda Function URL (alternative endpoint)"
  value       = aws_lambda_function_url.backend.function_url
}

output "api_gateway_id" {
  description = "API Gateway ID"
  value       = aws_apigatewayv2_api.backend.id
}
