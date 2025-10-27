# API Documentation

## Overview

IaC Converter provides two main API endpoints for converting infrastructure descriptions to Infrastructure as Code templates. Both endpoints are Next.js API routes that run as serverless functions.

## Base URL

### Local Development

```
http://localhost:3000/api
```

### Production (Vercel)

```
https://your-app.vercel.app/api
```

## Authentication

The API uses server-side environment variables for authentication with Claude AI. No authentication is required from the client, as API keys are securely stored on the server.

**Environment Variable Required**:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Endpoints

---

### 1. Convert Text to IaC

Converts natural language descriptions to Infrastructure as Code.

#### Endpoint

```
POST /api/convert-text
```

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

| Field       | Type     | Required | Description                                           |
| ----------- | -------- | -------- | ----------------------------------------------------- |
| `input`     | string   | Yes      | Natural language description of infrastructure        |
| `inputType` | string   | Yes      | Must be "text"                                        |
| `provider`  | string   | Yes      | Cloud provider: "aws", "azure", or "gcp"              |
| `formats`   | string[] | Yes      | Array of output formats (see supported formats below) |

**Supported Formats**:

- `"terraform"` - Terraform HCL
- `"cloudformation"` - AWS CloudFormation JSON
- `"pulumi-python"` - Pulumi Python
- `"pulumi-typescript"` - Pulumi TypeScript
- `"kubernetes"` - Kubernetes YAML
- `"docker-compose"` - Docker Compose YAML

#### Request Example

```json
{
  "input": "Create a web application with a load balancer, 3 EC2 instances, and an RDS MySQL database. Deploy in us-east-1 with high availability.",
  "inputType": "text",
  "provider": "aws",
  "formats": ["terraform", "cloudformation"]
}
```

#### Response

**Success Response** (200 OK):

```json
{
  "success": true,
  "parsed": {
    "provider": "aws",
    "region": "us-east-1",
    "resources": [
      {
        "type": "load_balancer",
        "name": "web-alb",
        "properties": {
          "type": "application",
          "scheme": "internet-facing"
        }
      },
      {
        "type": "compute",
        "name": "web-servers",
        "properties": {
          "instance_type": "t3.medium",
          "count": 3
        }
      },
      {
        "type": "database",
        "name": "mysql-db",
        "properties": {
          "engine": "mysql",
          "multi_az": true
        }
      }
    ],
    "network": {
      "vpc": "10.0.0.0/16",
      "subnets": {
        "public": ["10.0.1.0/24", "10.0.2.0/24"],
        "private": ["10.0.10.0/24", "10.0.11.0/24"]
      }
    },
    "security": {
      "security_groups": [
        {
          "name": "alb-sg",
          "ingress": ["80/tcp", "443/tcp"]
        },
        {
          "name": "web-sg",
          "ingress": ["80/tcp"]
        }
      ]
    }
  },
  "generated": [
    {
      "format": "terraform",
      "code": "# Terraform configuration code here...",
      "filename": "main.tf",
      "resources": [
        "aws_lb.web_alb",
        "aws_autoscaling_group.web_servers",
        "aws_db_instance.mysql_db",
        "aws_vpc.main",
        "aws_security_group.alb_sg"
      ]
    },
    {
      "format": "cloudformation",
      "code": "{\n  \"AWSTemplateFormatVersion\": \"2010-09-09\",\n  ...\n}",
      "filename": "template.json",
      "resources": ["WebALB", "WebServersASG", "MySQLDatabase", "VPC", "ALBSecurityGroup"]
    }
  ]
}
```

**Error Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Invalid request: 'provider' must be one of: aws, azure, gcp"
}
```

**Error Response** (500 Internal Server Error):

```json
{
  "success": false,
  "error": "Failed to convert infrastructure description. Please try again."
}
```

---

### 2. Convert Image to IaC

Converts architecture diagram images to Infrastructure as Code using Claude's vision capabilities.

#### Endpoint

```
POST /api/convert-image
```

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

| Field       | Type     | Required | Description                                     |
| ----------- | -------- | -------- | ----------------------------------------------- |
| `input`     | string   | Yes      | Base64-encoded image data with data URI prefix  |
| `inputType` | string   | Yes      | Must be "image"                                 |
| `provider`  | string   | Yes      | Cloud provider: "aws", "azure", or "gcp"        |
| `formats`   | string[] | Yes      | Array of output formats (see supported formats) |

**Supported Image Formats**:

- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- WebP (`.webp`)

**Size Limit**: 5 MB

#### Request Example

```json
{
  "input": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
  "inputType": "image",
  "provider": "aws",
  "formats": ["terraform"]
}
```

#### Response

Response format is identical to `/api/convert-text`.

---

## Response Schemas

### Success Response Schema

```typescript
interface ConversionResponse {
  success: true;
  parsed: ParsedInfrastructure;
  generated: GeneratedCode[];
}

interface ParsedInfrastructure {
  provider: "aws" | "azure" | "gcp";
  region?: string;
  resources: Resource[];
  network?: NetworkConfig;
  security?: SecurityConfig;
  monitoring?: MonitoringConfig;
}

interface Resource {
  type: string;
  name: string;
  properties: Record<string, any>;
}

interface NetworkConfig {
  vpc?: string;
  subnets?: {
    public?: string[];
    private?: string[];
  };
}

interface SecurityConfig {
  security_groups?: SecurityGroup[];
  iam_roles?: IAMRole[];
}

interface GeneratedCode {
  format: string;
  code: string;
  filename: string;
  resources: string[];
}
```

### Error Response Schema

```typescript
interface ErrorResponse {
  success: false;
  error: string;
}
```

## Error Codes

| Status Code | Description                                                |
| ----------- | ---------------------------------------------------------- |
| 200         | Success                                                    |
| 400         | Bad Request - Invalid input, provider, or format           |
| 401         | Unauthorized - Missing or invalid API key (server-side)    |
| 413         | Payload Too Large - Image exceeds 5MB                      |
| 429         | Too Many Requests - Rate limit exceeded (Claude API)       |
| 500         | Internal Server Error - Unexpected error during processing |
| 503         | Service Unavailable - Claude API temporarily unavailable   |

## Rate Limiting

Rate limiting is enforced by the Claude API. The limits depend on your Anthropic API plan:

- **Free Tier**: Limited requests per minute
- **Paid Tiers**: Higher limits based on your plan

When rate limits are exceeded, you'll receive a 429 error response.

## Usage Examples

### cURL Example - Text Conversion

```bash
curl -X POST http://localhost:3000/api/convert-text \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Create a serverless REST API with API Gateway and Lambda",
    "inputType": "text",
    "provider": "aws",
    "formats": ["terraform", "cloudformation"]
  }'
```

### cURL Example - Image Conversion

```bash
# First, encode your image to base64
IMAGE_DATA=$(base64 -i architecture.png)

curl -X POST http://localhost:3000/api/convert-image \
  -H "Content-Type: application/json" \
  -d '{
    "input": "data:image/png;base64,'"$IMAGE_DATA"'",
    "inputType": "image",
    "provider": "aws",
    "formats": ["terraform"]
  }'
```

### JavaScript/TypeScript Example

```typescript
async function convertToIaC(description: string) {
  const response = await fetch("/api/convert-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: description,
      inputType: "text",
      provider: "aws",
      formats: ["terraform", "cloudformation"],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const result = await response.json();
  return result;
}

// Usage
try {
  const result = await convertToIaC("Create a web application with load balancer and auto-scaling");
  console.log("Generated Terraform:", result.generated[0].code);
  console.log("Generated CloudFormation:", result.generated[1].code);
} catch (error) {
  console.error("Conversion failed:", error.message);
}
```

### Python Example

```python
import requests
import base64

def convert_text_to_iac(description, provider, formats):
    url = "http://localhost:3000/api/convert-text"
    payload = {
        "input": description,
        "inputType": "text",
        "provider": provider,
        "formats": formats
    }

    response = requests.post(url, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error: {response.json().get('error')}")

def convert_image_to_iac(image_path, provider, formats):
    url = "http://localhost:3000/api/convert-image"

    # Read and encode image
    with open(image_path, "rb") as image_file:
        encoded = base64.b64encode(image_file.read()).decode()

    # Detect image type
    ext = image_path.split('.')[-1].lower()
    mime_type = f"image/{ext}"

    payload = {
        "input": f"data:{mime_type};base64,{encoded}",
        "inputType": "image",
        "provider": provider,
        "formats": formats
    }

    response = requests.post(url, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error: {response.json().get('error')}")

# Usage
try:
    result = convert_text_to_iac(
        "Create a Kubernetes cluster with 3 nodes",
        "aws",
        ["terraform", "kubernetes"]
    )
    print("Success:", result["success"])
    print("Generated code:", result["generated"][0]["code"])
except Exception as e:
    print("Error:", str(e))
```

## Best Practices

### 1. Input Descriptions

- Be specific and detailed
- Include resource types, sizes, and configurations
- Specify regions and availability requirements
- Mention security requirements
- Include networking requirements

**Good Example**:

```
Create a production-ready web application with:
- Application Load Balancer (ALB) with SSL/TLS
- Auto Scaling Group with 2-5 EC2 t3.large instances
- RDS PostgreSQL 14 database with Multi-AZ enabled
- VPC with public and private subnets across 2 AZs
- S3 bucket for static assets with CloudFront CDN
- Security groups allowing HTTPS only
- Deploy in us-west-2
```

**Bad Example**:

```
Create a web app
```

### 2. Image Requirements

- Use clear, high-resolution diagrams
- Label components clearly
- Use standard cloud provider icons
- Include relationships between components
- Avoid handwritten or blurry diagrams

### 3. Error Handling

- Always handle API errors gracefully
- Implement retry logic for transient failures
- Validate input before sending requests
- Check for rate limit errors and back off

### 4. Performance

- Cache results when appropriate
- Avoid unnecessary API calls
- Use appropriate timeout values
- Consider streaming for large responses

## Limitations

1. **Claude API Limits**: Subject to Anthropic's rate limits and token limits
2. **Image Size**: Maximum 5MB per image
3. **Complexity**: Very complex infrastructures may require multiple conversions
4. **Accuracy**: Generated code should be reviewed before production use
5. **Context**: Limited to single infrastructure descriptions (no multi-part context)

## Troubleshooting

### Common Issues

**Issue**: "API key not configured"

- **Solution**: Ensure `ANTHROPIC_API_KEY` is set in `.env.local`

**Issue**: "Image too large"

- **Solution**: Compress image or reduce resolution (max 5MB)

**Issue**: "Invalid provider"

- **Solution**: Use only "aws", "azure", or "gcp"

**Issue**: "Failed to parse response"

- **Solution**: Check input clarity, try rephrasing description

**Issue**: Rate limit exceeded

- **Solution**: Wait and retry, or upgrade Anthropic API plan

## Support

For API-related issues:

1. Check the [README](../README.md) for setup instructions
2. Review [TROUBLESHOOTING](./TROUBLESHOOTING.md) guide
3. Open an issue on GitHub with:
   - Request payload (remove sensitive data)
   - Response received
   - Expected behavior
   - Environment details

## Changelog

See [CHANGELOG.md](../CHANGELOG.md) for API version history and breaking changes.
