# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-27

### Added

#### Core Features

- Text-to-IaC conversion using natural language descriptions
- Image-to-IaC conversion from architecture diagrams
- Multi-cloud provider support (AWS, Azure, GCP)
- Multiple IaC format support:
  - Terraform (HCL)
  - AWS CloudFormation (JSON)
  - Pulumi (Python & TypeScript)
  - Kubernetes (YAML)
  - Docker Compose (YAML)

#### User Interface

- Modern, responsive web interface built with Next.js 16
- Dark mode support with theme persistence
- Monaco Editor integration for syntax-highlighted code viewing
- Drag-and-drop image upload functionality
- One-click code copying and downloading
- Tabbed interface for multiple output formats

#### Template System

- Pre-built template library for common infrastructure patterns:
  - Basic Web Application (ALB + EC2 + RDS)
  - Serverless API (API Gateway + Lambda + DynamoDB)
  - Static Website (S3 + CloudFront)
  - Kubernetes Cluster (EKS/AKS/GKE)
  - Data Pipeline
  - Microservices Architecture
  - CI/CD Pipeline
  - Monitoring Stack
- Template search and filtering by category and provider
- Template preview and quick conversion

#### History & Settings

- Conversion history with local storage persistence
- Settings page for API key and preferences management
- Configurable default cloud provider and output formats
- Claude model selection

#### API Integration

- Claude AI integration for intelligent infrastructure parsing
- Vision API support for diagram analysis
- Streaming responses for better UX
- Error handling and retry logic

#### Documentation

- Comprehensive README with usage examples
- Quick start guide
- Deployment instructions for Vercel and Docker
- API endpoint documentation
- Troubleshooting guide

### Technical Details

- Built with Next.js 16 and TypeScript
- Server-side API routes for secure API key handling
- Client-side state management with localStorage
- Tailwind CSS for styling
- Monaco Editor for code display
- Lucide React for icons
- Full TypeScript type coverage

### Security

- Server-side API key handling (keys never exposed to client)
- Input validation and sanitization
- File upload restrictions (type and size limits)
- Environment variable protection

---

## [Unreleased]

### Planned Features

- Unit and integration tests
- E2E testing with Playwright
- More cloud providers (Oracle Cloud, IBM Cloud)
- Additional IaC formats (Ansible, Chef, Puppet)
- Cost estimation for generated infrastructure
- Infrastructure validation and best practices checks
- Team collaboration features
- Export to GitHub/GitLab repositories
- Infrastructure state management
- Multi-language support

---

## Version Format

`[MAJOR.MINOR.PATCH] - YYYY-MM-DD`

### Types of Changes

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

---

[1.0.0]: https://github.com/yourusername/iac-converter/releases/tag/v1.0.0
