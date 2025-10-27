# Architecture Documentation

## Overview

IaC Converter is a Next.js 16 application that leverages Claude AI to convert natural language descriptions and architecture diagrams into Infrastructure as Code templates. The application follows a modern, serverless architecture with a focus on security, performance, and user experience.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Input    │  │   Output     │  │    Template      │   │
│  │   Panel    │  │   Panel      │  │    Library       │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
│         │                │                    │             │
│         └────────────────┴────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Routes
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Next.js API)                     │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  /api/convert-   │         │  /api/convert-   │         │
│  │      text        │         │     image        │         │
│  └──────────────────┘         └──────────────────┘         │
│         │                              │                    │
│         └──────────────┬───────────────┘                    │
└────────────────────────┼──────────────────────────────────┘
                         │
                         │ External API
                         ↓
             ┌────────────────────────┐
             │   Claude AI (Anthropic) │
             │   - Vision API         │
             │   - Conversation API   │
             └────────────────────────┘
                         │
                         ↓
             ┌────────────────────────┐
             │   IaC Code Generation  │
             │   - Terraform          │
             │   - CloudFormation     │
             │   - Pulumi             │
             │   - Kubernetes         │
             └────────────────────────┘
```

## Technology Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Monaco Editor**: Code editor component
- **Lucide React**: Icon library
- **localStorage**: Client-side state persistence

### Backend

- **Next.js API Routes**: Serverless backend
- **Anthropic SDK**: Claude AI integration
- **Node.js 18+**: Runtime environment

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking
- **Git**: Version control

## Core Components

### 1. Input Panel (`components/InputPanel`)

**Purpose**: Handles user input for text descriptions and image uploads.

**Key Features**:

- Text input with syntax highlighting
- Drag-and-drop image upload
- Input type switching (text/image)
- Cloud provider selection
- Output format selection
- Template integration

**State Management**:

- Input type (text/image)
- Input content
- Selected cloud provider
- Selected output formats
- Validation state

### 2. Output Panel (`components/OutputPanel`)

**Purpose**: Displays generated IaC code with syntax highlighting.

**Key Features**:

- Monaco Editor integration
- Syntax highlighting per format
- Copy to clipboard
- Download code files
- Tabbed interface for multiple formats
- Loading states and error handling

**Rendering**:

- Dynamic language detection
- Syntax highlighting themes
- Code formatting

### 3. Template Library (`components/TemplateLibrary`)

**Purpose**: Provides pre-built infrastructure templates.

**Key Features**:

- Template browsing
- Search and filtering
- Category organization
- Cloud provider filtering
- One-click template application

**Template Structure**:

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: CloudProvider;
  prompt: string;
  tags: string[];
}
```

### 4. Settings Page (`app/settings`)

**Purpose**: User configuration and preferences.

**Key Features**:

- API key management
- Default provider selection
- Default format selection
- Model selection
- Theme preferences

### 5. History Page (`app/history`)

**Purpose**: Tracks previous conversions.

**Key Features**:

- Conversion history list
- Detailed view
- Search and filtering
- Clear history
- Re-run conversions

## API Architecture

### API Route: `/api/convert-text`

**Purpose**: Converts text descriptions to IaC code.

**Flow**:

1. Receive request with text input, provider, and formats
2. Validate input and configuration
3. Call Claude API with structured prompt
4. Parse Claude's response into structured infrastructure
5. Generate code for each requested format
6. Return structured response

**Request Schema**:

```typescript
{
  input: string;
  inputType: "text";
  provider: "aws" | "azure" | "gcp";
  formats: Array<
    | "terraform"
    | "cloudformation"
    | "pulumi-python"
    | "pulumi-typescript"
    | "kubernetes"
    | "docker-compose"
  >;
}
```

**Response Schema**:

```typescript
{
  success: boolean;
  parsed: {
    provider: string;
    resources: Array<Resource>;
    network: NetworkConfig;
    security: SecurityConfig;
  };
  generated: Array<{
    format: string;
    code: string;
    filename: string;
    resources: Array<string>;
  }>;
  error?: string;
}
```

### API Route: `/api/convert-image`

**Purpose**: Converts architecture diagrams to IaC code.

**Flow**:

1. Receive request with base64 image, provider, and formats
2. Validate image (type, size)
3. Call Claude Vision API with image and prompt
4. Extract infrastructure components from diagram
5. Generate code for each requested format
6. Return structured response

**Request Schema**:

```typescript
{
  input: string; // base64 encoded image
  inputType: "image";
  provider: "aws" | "azure" | "gcp";
  formats: Array<string>;
}
```

**Response Schema**: Same as `/api/convert-text`

## Data Flow

### Text-to-IaC Conversion

```
User Input → Input Panel → API Route → Claude AI → Parser → Code Generators → Output Panel
```

### Image-to-IaC Conversion

```
User Upload → Image Processing → API Route → Claude Vision → Parser → Code Generators → Output Panel
```

### Template Usage

```
Template Selection → Template Library → Auto-populate Input → API Route → Code Generation → Output Panel
```

## State Management

### Client-Side State

The application uses React hooks for state management:

**Global State** (via Context):

- Theme preferences (dark/light mode)

**Local State** (useState):

- Input content
- Selected provider
- Selected formats
- Generated code
- Loading states
- Error states

**Persistent State** (localStorage):

- API key (optional for client-side storage)
- Conversion history
- User preferences
- Default settings

### Server-Side State

API routes are stateless. Each request is independent and contains all necessary information.

## Security Architecture

### API Key Protection

```
Environment Variables (.env.local)
          ↓
  Server-Side API Routes
          ↓
    Anthropic SDK
```

**Key Principle**: API keys never reach the client. All Claude API calls are made server-side.

### Input Validation

- Text input: Length limits, content sanitization
- Image uploads: Type validation, size limits (5MB)
- Format selection: Whitelist validation
- Provider selection: Enum validation

### Output Sanitization

Generated code is displayed in Monaco Editor, which handles code escaping automatically.

## Code Generation Architecture

### Generator Pattern

Each IaC format has a dedicated generator:

```typescript
interface IaCGenerator {
  generate(parsed: InfrastructureSpec): string;
}

class TerraformGenerator implements IaCGenerator {
  generate(spec: InfrastructureSpec): string {
    // Generate Terraform HCL
  }
}

class CloudFormationGenerator implements IaCGenerator {
  generate(spec: InfrastructureSpec): string {
    // Generate CloudFormation JSON
  }
}
```

### Generator Responsibilities

1. Transform parsed infrastructure into format-specific syntax
2. Apply best practices for the format
3. Include necessary providers/imports
4. Add helpful comments
5. Format code properly

## Error Handling

### Client-Side Errors

- Input validation errors → User-friendly messages
- API call failures → Retry logic + error display
- Network errors → Offline detection + guidance

### Server-Side Errors

- Claude API errors → Graceful degradation + retry
- Parsing errors → Detailed error messages
- Validation errors → 400 status with details
- Server errors → 500 status with generic message

## Performance Considerations

### Frontend Optimization

- Code splitting with Next.js App Router
- Lazy loading of Monaco Editor
- Image optimization with Next.js Image
- Debounced input for real-time features
- Virtual scrolling for long lists (history)

### Backend Optimization

- Streaming responses for long operations
- Request timeout handling
- Rate limiting (future enhancement)
- Caching for template data

### Network Optimization

- Compression for API responses
- Efficient base64 encoding for images
- Minimized payload sizes

## Deployment Architecture

### Vercel (Recommended)

```
GitHub Repository
      ↓
 Vercel Build
      ↓
Edge Network (CDN)
      ↓
Serverless Functions (API Routes)
      ↓
Claude AI API
```

**Benefits**:

- Automatic deployments
- Edge caching
- Serverless scaling
- Built-in SSL
- Preview deployments for PRs

### Docker

```
Docker Image
      ↓
Container Runtime
      ↓
Node.js Server
      ↓
Claude AI API
```

**Benefits**:

- Portable deployment
- Consistent environments
- Self-hosted option

## Scalability

### Current Limitations

- localStorage limits (5-10MB per domain)
- No backend database
- Client-side history storage

### Future Scalability Enhancements

1. Add database for persistent history
2. Implement user authentication
3. Add rate limiting
4. Implement caching layer
5. Add queue for long-running conversions
6. Multi-region deployment

## Monitoring & Observability

### Current State

- Browser console for client-side errors
- Next.js build logs
- Vercel deployment logs

### Recommended Additions

1. Error tracking (Sentry)
2. Analytics (Vercel Analytics, Google Analytics)
3. Performance monitoring (Web Vitals)
4. API usage tracking
5. User behavior analytics

## Extension Points

### Adding New Cloud Providers

1. Add provider to type definitions
2. Create generator for provider-specific IaC
3. Update API routes to handle new provider
4. Add templates for new provider

### Adding New IaC Formats

1. Create generator class
2. Add format to type definitions
3. Register generator in code generation logic
4. Add Monaco Editor language support
5. Create templates for new format

### Adding Features

1. New input types (YAML, JSON config)
2. Cost estimation
3. Security scanning
4. Infrastructure validation
5. Multi-file projects
6. Git integration

## Design Patterns Used

1. **Component Pattern**: Reusable UI components
2. **Generator Pattern**: Pluggable code generators
3. **Factory Pattern**: Creating generators based on format
4. **Repository Pattern**: Data access abstraction (future)
5. **Strategy Pattern**: Different conversion strategies per provider

## Development Workflow

```
Feature Branch → Local Development → Testing → PR → CI/CD → Preview → Review → Merge → Production
```

## Testing Strategy (Future)

### Unit Tests

- Utility functions
- Code generators
- Parsers

### Integration Tests

- API routes
- Component interactions
- End-to-end flows

### E2E Tests

- Full user workflows
- Cross-browser testing
- Performance testing

## Conclusion

IaC Converter follows modern web application architecture patterns with a focus on:

- Security (server-side API key handling)
- Performance (code splitting, lazy loading)
- Maintainability (TypeScript, clear separation of concerns)
- Extensibility (pluggable generators, configurable components)
- User Experience (responsive design, real-time feedback)

This architecture provides a solid foundation for future enhancements while maintaining simplicity and developer productivity.
