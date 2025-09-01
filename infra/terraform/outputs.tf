output "lambda_url" {
  value = "${aws_apigatewayv2_api.http.api_endpoint}/invoice"
}