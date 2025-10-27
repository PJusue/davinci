# IaC Converter - Text & Image to Infrastructure as Code

A modern, production-ready web application that converts natural language descriptions and architecture diagrams into Infrastructure as Code templates using Claude AI.

## Features

- **Text-to-IaC Conversion**: Describe your infrastructure in natural language and get production-ready IaC code
- **Image-to-IaC Conversion**: Upload architecture diagrams and automatically extract infrastructure components
- **Multi-Cloud Support**: Generate code for AWS, Azure, and GCP
- **Multiple IaC Formats**:
  - Terraform (HCL)
  - AWS CloudFormation (JSON)
  - Pulumi (Python & TypeScript)
- **Template Library**: Pre-built templates for common infrastructure patterns
- **Conversion History**: Track and review your previous conversions
- **Dark Mode**: Professional UI with light/dark theme support
- **Monaco Editor**: Syntax-highlighted code editor with copy and download functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Code Editor**: Monaco Editor
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Installation & Setup

### 1. Clone or Navigate to the Project

```bash
cd iac-converter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

**Important**: Never commit your `.env.local` file to version control!

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Text-to-IaC Conversion

1. Select the **Text** input type
2. Choose your cloud provider (AWS, Azure, or GCP)
3. Select one or more output formats
4. Enter your infrastructure description in natural language
5. Click **Convert to IaC**

**Example Input:**

```
Create a web application infrastructure with:
- Application Load Balancer for traffic distribution
- Auto Scaling Group with 2-4 EC2 t3.medium instances
- RDS PostgreSQL database with Multi-AZ enabled
- VPC with public and private subnets across 2 availability zones
- Security groups allowing HTTP/HTTPS traffic to ALB
- S3 bucket for static assets with CloudFront distribution
```

### Image-to-IaC Conversion

1. Select the **Image** input type
2. Choose your cloud provider
3. Select output formats
4. Upload an architecture diagram (drag-and-drop or browse)
5. Click **Convert to IaC**

**Supported image formats**: JPEG, PNG, GIF, WebP (max 5MB)

### Using Templates

1. Click the **Templates** button in the header
2. Browse or search for a template
3. Filter by category or cloud provider
4. Click on a template to auto-populate and convert

**Available Templates:**

- Basic Web Application (ALB + EC2 + RDS)
- Serverless API (API Gateway + Lambda + DynamoDB)
- Static Website (S3 + CloudFront)
- Kubernetes Cluster (EKS)
- Data Pipeline (Kinesis + Lambda + S3)
- Microservices Architecture (ECS Fargate)
- CI/CD Pipeline
- Azure Web App
- GCP Web Application
- Monitoring Stack

### Viewing History

1. Click the **History** button to view past conversions
2. Select a conversion to see details
3. Clear history if needed

### Configuring Settings

1. Click the **Settings** button
2. Enter your Anthropic API key (stored locally)
3. Select default cloud provider and output formats
4. Choose your preferred Claude model
5. Click **Save Settings**

## Project Structure

```
iac-converter/
├── app/
│   ├── api/
│   │   ├── convert-text/      # Text conversion API endpoint
│   │   └── convert-image/     # Image conversion API endpoint
│   ├── history/                # Conversion history page
│   ├── settings/               # Settings page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main converter page
│   └── providers.tsx          # Theme provider
├── components/
│   ├── CodeEditor/            # Monaco editor wrapper
│   ├── InputPanel/            # Input area component
│   ├── OutputPanel/           # Output display component
│   └── TemplateLibrary/       # Template selection modal
├── lib/
│   ├── claude-api.ts          # Claude API integration
│   ├── iac-generators.ts      # IaC code generators
│   ├── storage.ts             # LocalStorage utilities
│   ├── templates.ts           # Template definitions
│   └── utils.ts               # Helper functions
├── types/
│   └── infrastructure.ts      # TypeScript type definitions
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## API Endpoints

### POST /api/convert-text

Converts natural language text to IaC code.

**Request Body:**

```json
{
  "input": "Infrastructure description...",
  "inputType": "text",
  "provider": "aws",
  "formats": ["terraform", "cloudformation"]
}
```

**Response:**

```json
{
  "success": true,
  "parsed": {
    "provider": "aws",
    "resources": [...],
    "network": {...},
    "security": {...}
  },
  "generated": [
    {
      "format": "terraform",
      "code": "...",
      "filename": "main.tf",
      "resources": [...]
    }
  ]
}
```

### POST /api/convert-image

Converts architecture diagram images to IaC code.

**Request Body:**

```json
{
  "input": "data:image/png;base64,...",
  "inputType": "image",
  "provider": "aws",
  "formats": ["terraform"]
}
```

**Response:** Same as convert-text endpoint

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t iac-converter .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_key iac-converter
```

## Security Considerations

- API keys are stored in browser localStorage and never sent to servers
- All API calls are made from the server-side API routes
- Input validation and sanitization on all endpoints
- File upload restrictions (type, size)
- CORS configuration for API endpoints

## Troubleshooting

### "API key not configured" Error

Make sure you've:

1. Created a `.env.local` file
2. Added your Anthropic API key
3. Restarted the development server

### Image Upload Not Working

Check that:

1. Image is under 5MB
2. Image format is JPEG, PNG, GIF, or WebP
3. Browser has necessary permissions

### Generated Code Issues

- Review the input description for clarity
- Try using a template as a starting point
- Ensure all required infrastructure components are mentioned
- Check that the selected cloud provider matches your needs

## Examples

### Example 1: Simple Web Application

**Input:**

```
I need a basic web application with a load balancer, 3 web servers,
and a MySQL database. Use t3.small instances and deploy in us-east-1.
```

**Output:** Terraform code with ALB, EC2 Auto Scaling Group, and RDS MySQL

### Example 2: Serverless API

**Input:**

```
Create a serverless REST API with:
- API Gateway with CORS enabled
- Lambda functions written in Node.js
- DynamoDB table for data storage
- CloudWatch for logging and monitoring
```

**Output:** Complete serverless infrastructure with all components

### Example 3: Kubernetes Cluster

**Input:**

```
Set up an EKS cluster with:
- Kubernetes version 1.29
- 2 node groups (one for general workloads, one for batch jobs)
- t3.large instances, scaling from 2 to 10 nodes
- VPC with private subnets
- Enable cluster autoscaler and metrics server
```

**Output:** Full EKS setup with managed node groups and networking

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

ISC

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Acknowledgments

- Built with [Claude AI](https://www.anthropic.com/claude) by Anthropic
- Powered by [Next.js](https://nextjs.org/)
- Code editing by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- Icons by [Lucide](https://lucide.dev/)
