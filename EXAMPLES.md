# IaC Converter - Usage Examples

This document provides detailed examples of how to use the IaC Converter for various infrastructure scenarios.

## Table of Contents

1. [AWS Examples](#aws-examples)
2. [Azure Examples](#azure-examples)
3. [GCP Examples](#gcp-examples)
4. [Complex Scenarios](#complex-scenarios)
5. [Image Processing Examples](#image-processing-examples)

## AWS Examples

### Example 1: Three-Tier Web Application

**Input:**

```
Create a production-ready three-tier web application:

Frontend:
- CloudFront distribution for content delivery
- S3 bucket for static website hosting
- Route53 for DNS management

Application Tier:
- Application Load Balancer
- Auto Scaling Group with 3-10 EC2 t3.medium instances
- Target group health checks every 30 seconds

Database Tier:
- RDS PostgreSQL 14 with Multi-AZ deployment
- db.t3.large instance class
- 100 GB storage with encryption enabled
- Automated backups with 7-day retention

Networking:
- VPC with CIDR 10.0.0.0/16
- 3 public subnets across 3 AZs for ALB
- 3 private subnets across 3 AZs for EC2 instances
- 3 isolated subnets across 3 AZs for RDS
- NAT Gateway in each AZ for high availability
- VPC Flow Logs enabled

Security:
- WAF with rate limiting rules on CloudFront
- Security group allowing only HTTPS (443) to ALB
- Security group allowing only ALB to EC2 instances
- Security group allowing only EC2 to RDS (port 5432)
- Enable encryption at rest for all resources
```

**Expected Output**: Complete Terraform configuration with VPC, subnets, route tables, security groups, ALB, Auto Scaling Group, RDS, CloudFront, S3, and Route53 resources.

### Example 2: Serverless Microservices

**Input:**

```
Build a serverless microservices architecture:

API Gateway:
- REST API with regional endpoint
- API key required for authentication
- Request throttling: 1000 requests per second
- CORS enabled for specific origins

Lambda Functions:
- 5 Lambda functions (users, orders, products, payments, notifications)
- Runtime: Node.js 20.x
- Memory: 512 MB
- Timeout: 30 seconds
- Environment variables from Parameter Store
- X-Ray tracing enabled

Data Layer:
- DynamoDB tables for each service with on-demand capacity
- Global Secondary Indexes for common query patterns
- Point-in-time recovery enabled
- Encryption using AWS managed keys

Message Queue:
- SQS queue for asynchronous processing
- Dead letter queue for failed messages
- Visibility timeout: 300 seconds

Monitoring:
- CloudWatch Log Groups for each Lambda
- CloudWatch Alarms for error rates and duration
- SNS topic for alarm notifications

IAM:
- Least privilege execution roles for each Lambda
- Resource-based policies for cross-service access
```

**Expected Output**: Terraform configuration with API Gateway, Lambda functions, DynamoDB tables, SQS queues, IAM roles and policies, CloudWatch resources.

### Example 3: Data Lake and Analytics

**Input:**

```
Set up a data lake and analytics platform:

Storage:
- S3 bucket for raw data with lifecycle policies
- S3 bucket for processed data
- S3 bucket for query results
- Server-side encryption with KMS
- Versioning enabled on all buckets

Ingestion:
- Kinesis Data Stream with 5 shards
- Kinesis Firehose for S3 delivery
- Lambda for data transformation
- Buffer size: 5 MB, buffer interval: 300 seconds

Processing:
- Glue Data Catalog for metadata
- Glue Crawler for schema discovery
- Glue ETL jobs for data transformation
- EMR cluster for complex analytics (optional)

Query:
- Athena workgroup for querying
- Query result location in S3
- Enforce workgroup configuration

Orchestration:
- Step Functions for workflow orchestration
- EventBridge rules for scheduling
- SNS for job notifications

Security:
- KMS keys for encryption
- IAM roles with appropriate permissions
- S3 bucket policies restricting access
- VPC endpoints for private connectivity
```

**Expected Output**: Complete infrastructure for a serverless data lake with ingestion, processing, and querying capabilities.

## Azure Examples

### Example 4: Azure Web Application

**Input:**

```
Deploy a scalable web application on Azure:

Compute:
- App Service Plan: Standard S2
- App Service with:
  - .NET 8 runtime
  - Always On enabled
  - Auto-scaling rules (CPU > 70%)
  - Scale from 2 to 5 instances
  - Health check path: /health

Database:
- Azure SQL Database
- Standard S2 tier (50 DTUs)
- Geo-replication to secondary region
- Automated backups with 35-day retention
- Transparent data encryption enabled
- Firewall rules for App Service

Caching:
- Azure Cache for Redis
- Standard C1 tier
- SSL-only enabled

Storage:
- Storage Account for static assets
- Blob container with public read access
- CDN endpoint for content delivery

Networking:
- Virtual Network with subnet delegation
- Private endpoints for SQL and Redis
- Application Gateway with WAF v2

Monitoring:
- Application Insights for APM
- Log Analytics workspace
- Azure Monitor alerts for availability and performance

Security:
- Key Vault for secrets and connection strings
- Managed identities for all resources
- Network Security Groups
```

**Expected Output**: Azure Resource Manager or Terraform configuration for a complete web application stack.

## GCP Examples

### Example 5: Google Cloud Platform Web Service

**Input:**

```
Create a modern web service on GCP:

Container Platform:
- Cloud Run service with:
  - Min instances: 2
  - Max instances: 100
  - CPU: 2 vCPU
  - Memory: 4 GB
  - Request timeout: 60 seconds
  - Concurrency: 80 requests per instance
- Artifact Registry for container images

Database:
- Cloud SQL PostgreSQL 14
- db-custom-4-16384 (4 vCPU, 16 GB RAM)
- High availability configuration
- Automated backups daily at 3 AM
- Private IP only

Load Balancing:
- Global HTTP(S) Load Balancer
- Cloud CDN enabled
- SSL certificate managed by Google
- Backend service with Cloud Run NEG

Networking:
- VPC with custom subnets
- Private Service Connection for Cloud SQL
- Cloud NAT for outbound traffic
- VPC firewall rules

Storage:
- Cloud Storage bucket for uploads
- Nearline storage class for archives
- Object lifecycle management

Monitoring:
- Cloud Monitoring workspace
- Uptime checks
- Log-based metrics
- Alerting policies

Security:
- Secret Manager for sensitive data
- Identity-Aware Proxy for admin access
- Cloud Armor security policies
```

**Expected Output**: GCP infrastructure code with Cloud Run, Cloud SQL, Load Balancer, VPC, and monitoring.

## Complex Scenarios

### Example 6: Multi-Region High Availability

**Input:**

```
Design a multi-region, highly available architecture on AWS:

Primary Region (us-east-1):
- Full application stack (ALB, EC2, RDS)
- S3 bucket with cross-region replication
- Route53 health checks

Secondary Region (us-west-2):
- Standby application stack
- RDS read replica promoted on failure
- S3 replica bucket

Global Services:
- Route53 with failover routing policy
- CloudFront with origin groups
- Global Accelerator for TCP traffic

Data Replication:
- RDS cross-region read replica
- DynamoDB global tables
- S3 cross-region replication

Disaster Recovery:
- Automated snapshots in both regions
- Lambda functions for failover automation
- SNS notifications for health check failures

Monitoring:
- CloudWatch cross-region dashboard
- Route53 health checks
- Synthetic monitoring with CloudWatch Synthetics
```

### Example 7: Hybrid Cloud Integration

**Input:**

```
Set up hybrid cloud connectivity:

AWS Side:
- Virtual Private Gateway attached to VPC
- Customer Gateway representing on-premises router
- Site-to-Site VPN connection with BGP
- Transit Gateway for multi-VPC connectivity
- Direct Connect for dedicated network connection

On-Premises Integration:
- VPN tunnel configuration
- BGP routing setup
- Redundant tunnels for high availability

Security:
- Network ACLs for subnet-level security
- Security groups for instance-level security
- VPN connection with IKEv2 encryption
- CloudHSM for key management

DNS Resolution:
- Route53 Resolver endpoints
- Inbound and outbound endpoints
- Forwarding rules for hybrid DNS

Monitoring:
- VPN tunnel status monitoring
- CloudWatch metrics for VPN
- VPC Flow Logs for traffic analysis
```

## Image Processing Examples

### Best Practices for Architecture Diagrams

When uploading architecture diagrams, ensure they include:

1. **Clear Service Labels**: Label each component with the service name (e.g., "EC2", "RDS", "ALB")
2. **Connection Lines**: Show data flow and relationships between services
3. **Network Boundaries**: Indicate VPCs, subnets, availability zones
4. **Security Elements**: Mark security groups, NACLs, firewalls
5. **Text Annotations**: Add notes about instance types, storage sizes, etc.

### Example Diagram Elements to Include

For AWS:

```
┌─────────────────────────────────────────┐
│             VPC (10.0.0.0/16)          │
│                                         │
│  ┌──────────────┐   ┌──────────────┐  │
│  │Public Subnet │   │Private Subnet│  │
│  │              │   │              │  │
│  │    ALB       │──▶│  EC2 (t3.m) │  │
│  │              │   │              │  │
│  └──────────────┘   └──────────────┘  │
│                           │            │
│                           ▼            │
│                    ┌──────────────┐   │
│                    │     RDS      │   │
│                    │  PostgreSQL  │   │
│                    └──────────────┘   │
└─────────────────────────────────────────┘
```

Include:

- Service icons or names
- Network boundaries (VPC, subnets)
- Instance types and configurations
- Connection arrows showing data flow
- Security group indicators

## Tips for Better Results

1. **Be Specific**: Include instance types, storage sizes, and specific configurations
2. **Mention Security**: Always specify security requirements and access patterns
3. **Define Networking**: Clearly describe VPC structure, subnets, and connectivity
4. **Include Monitoring**: Request logging, monitoring, and alerting components
5. **State Requirements**: Mention high availability, backup, and disaster recovery needs
6. **Use Templates**: Start with a template and customize as needed
7. **Iterative Approach**: Generate basic infrastructure first, then add complexity

## Common Patterns

### Pattern 1: Web Application

```
Load Balancer → Web Servers → Application Servers → Database
```

### Pattern 2: Microservices

```
API Gateway → Lambda Functions → DynamoDB/RDS → SQS/SNS
```

### Pattern 3: Data Pipeline

```
Data Source → Kinesis/EventBridge → Processing → Storage → Analytics
```

### Pattern 4: Static Site

```
Route53 → CloudFront → S3 → (Optional) API Gateway + Lambda
```

## Next Steps

After generating IaC code:

1. **Review the Code**: Check for accuracy and completeness
2. **Customize**: Adjust parameters like instance types, regions, and naming
3. **Add Variables**: Extract hard-coded values into variables
4. **Plan Deployment**: Use `terraform plan` or CloudFormation change sets
5. **Test in Dev**: Deploy to a development environment first
6. **Apply Security**: Review and enhance security configurations
7. **Set Up CI/CD**: Integrate with your deployment pipeline
8. **Document**: Add comments and documentation to the generated code

## Feedback

If the generated code doesn't meet your expectations:

- Provide more detailed descriptions
- Use specific service names and configurations
- Reference the architecture diagram more explicitly
- Try breaking down complex requests into smaller parts
- Use templates as starting points
