import { InfrastructureTemplate } from "@/types/infrastructure";

export const TEMPLATES: InfrastructureTemplate[] = [
  {
    id: "web-app-basic",
    name: "Basic Web Application",
    description: "Load balancer, EC2 instances, and RDS database",
    category: "Web Applications",
    provider: "aws",
    prompt: `Create a basic web application infrastructure with:
- Application Load Balancer for traffic distribution
- Auto Scaling Group with 2-4 EC2 t3.medium instances
- RDS PostgreSQL database (db.t3.small) with Multi-AZ
- VPC with public and private subnets across 2 availability zones
- Security groups allowing HTTP/HTTPS traffic to ALB and database access from app servers
- S3 bucket for static assets`,
    example: "ALB → EC2 Auto Scaling Group → RDS",
  },
  {
    id: "serverless-api",
    name: "Serverless API",
    description: "API Gateway, Lambda functions, and DynamoDB",
    category: "Serverless",
    provider: "aws",
    prompt: `Create a serverless API infrastructure with:
- API Gateway REST API with multiple endpoints
- Lambda functions (Node.js 20.x) for API handlers
- DynamoDB table with on-demand capacity
- CloudWatch Logs for monitoring
- IAM roles and policies for Lambda execution
- API Gateway authorizer for authentication`,
    example: "API Gateway → Lambda → DynamoDB",
  },
  {
    id: "static-website",
    name: "Static Website",
    description: "S3, CloudFront CDN, and Route53",
    category: "Web Applications",
    provider: "aws",
    prompt: `Create a static website hosting infrastructure with:
- S3 bucket configured for static website hosting
- CloudFront distribution for CDN
- Route53 hosted zone and DNS records
- ACM certificate for HTTPS
- S3 bucket policy for CloudFront access
- WAF web ACL for security`,
    example: "Route53 → CloudFront → S3",
  },
  {
    id: "kubernetes-cluster",
    name: "Kubernetes Cluster",
    description: "EKS cluster with managed node groups",
    category: "Containers",
    provider: "aws",
    prompt: `Create a Kubernetes infrastructure with:
- EKS cluster (version 1.29)
- Managed node group with t3.large instances (2-5 nodes)
- VPC with public and private subnets
- IAM roles for cluster and node groups
- Security groups for cluster communication
- EBS CSI driver for persistent storage
- Application Load Balancer Controller`,
    example: "EKS Cluster → Node Groups → Pods",
  },
  {
    id: "data-pipeline",
    name: "Data Pipeline",
    description: "Data ingestion and processing pipeline",
    category: "Data & Analytics",
    provider: "aws",
    prompt: `Create a data pipeline infrastructure with:
- Kinesis Data Stream for real-time ingestion
- Lambda functions for stream processing
- S3 bucket for data lake storage
- Glue Data Catalog for metadata
- Athena for querying
- Step Functions for workflow orchestration
- CloudWatch alarms for monitoring`,
    example: "Kinesis → Lambda → S3 → Athena",
  },
  {
    id: "microservices",
    name: "Microservices Architecture",
    description: "ECS Fargate with service mesh",
    category: "Containers",
    provider: "aws",
    prompt: `Create a microservices infrastructure with:
- ECS cluster with Fargate launch type
- Multiple ECS services for different microservices
- Application Load Balancer with target groups
- Service Discovery with Cloud Map
- RDS Aurora Serverless for database
- ElastiCache Redis for caching
- VPC with private subnets
- NAT Gateway for outbound internet access`,
    example: "ALB → ECS Services → Aurora + Redis",
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description: "Complete CI/CD infrastructure",
    category: "DevOps",
    provider: "aws",
    prompt: `Create a CI/CD pipeline infrastructure with:
- CodeCommit repository for source control
- CodeBuild project for building artifacts
- CodeDeploy for deployment automation
- CodePipeline for orchestration
- S3 bucket for artifact storage
- ECR repository for container images
- IAM roles and policies
- SNS topic for notifications`,
    example: "CodeCommit → CodeBuild → CodeDeploy",
  },
  {
    id: "azure-web-app",
    name: "Azure Web App",
    description: "App Service with SQL Database",
    category: "Web Applications",
    provider: "azure",
    prompt: `Create an Azure web application infrastructure with:
- App Service Plan (Standard S1)
- App Service for web hosting
- Azure SQL Database (Standard S0)
- Application Insights for monitoring
- Key Vault for secrets management
- Virtual Network for network isolation
- NSG for security rules`,
    example: "App Service → SQL Database",
  },
  {
    id: "gcp-webapp",
    name: "GCP Web Application",
    description: "Cloud Run with Cloud SQL",
    category: "Web Applications",
    provider: "gcp",
    prompt: `Create a GCP web application infrastructure with:
- Cloud Run service for containerized app
- Cloud SQL PostgreSQL instance
- Cloud Load Balancing for traffic distribution
- VPC network with private IP
- Cloud Armor for security
- Cloud CDN for content delivery
- Cloud Storage bucket for static assets`,
    example: "Load Balancer → Cloud Run → Cloud SQL",
  },
  {
    id: "monitoring-stack",
    name: "Monitoring Stack",
    description: "Complete observability solution",
    category: "Monitoring",
    provider: "aws",
    prompt: `Create a monitoring infrastructure with:
- CloudWatch Log Groups and Streams
- CloudWatch Dashboards for visualization
- CloudWatch Alarms with SNS notifications
- X-Ray for distributed tracing
- EventBridge rules for event routing
- Lambda function for custom metrics
- S3 bucket for log archival`,
    example: "CloudWatch → SNS → Lambda",
  },
];

export function getTemplateById(id: string): InfrastructureTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByProvider(provider: string): InfrastructureTemplate[] {
  return TEMPLATES.filter((t) => t.provider === provider);
}

export function getTemplatesByCategory(category: string): InfrastructureTemplate[] {
  return TEMPLATES.filter((t) => t.category === category);
}

export function getCategories(): string[] {
  const categories = new Set(TEMPLATES.map((t) => t.category));
  return Array.from(categories).sort();
}
