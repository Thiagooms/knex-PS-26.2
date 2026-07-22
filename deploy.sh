#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"

echo "==> Phase 1/3: create the ECR repository"
terraform -chdir=infra init -input=false
terraform -chdir=infra apply -input=false -auto-approve -target=aws_ecr_repository.api

ECR_URL="$(terraform -chdir=infra output -raw ecr_repository_url)"
REGISTRY="${ECR_URL%/*}"
echo "==> ECR repository: ${ECR_URL}"

echo "==> Phase 2/3: build and push the image (linux/amd64)"
aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${REGISTRY}"
docker build --platform linux/amd64 --provenance=false -f Dockerfile -t "${ECR_URL}:latest" .
docker push "${ECR_URL}:latest"

echo "==> Phase 3/3: provision RDS and App Runner (takes ~15 min)"
terraform -chdir=infra apply -input=false -auto-approve

echo "==> Done. Public API URL:"
terraform -chdir=infra output -raw api_url
echo ""
