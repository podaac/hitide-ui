resource "aws_s3_bucket" "hitide-site-bucket" {
  bucket = local.ec2_resources_name
  acl    = "private"

  tags = local.default_tags
}

output "hitide-bucket-name" {
  value = aws_s3_bucket.hitide-site-bucket.id
}