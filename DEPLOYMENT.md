# Deployment Guide

This guide covers deploying the IaC Converter to various platforms.

## Table of Contents

1. [Vercel (Recommended)](#vercel-deployment)
2. [Docker](#docker-deployment)
3. [AWS (EC2 + Docker)](#aws-deployment)
4. [Environment Variables](#environment-variables)

## Vercel Deployment

Vercel provides the easiest deployment option with zero configuration.

### Steps

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**

   Add these in the Vercel dashboard under Settings → Environment Variables:

   ```
   ANTHROPIC_API_KEY=your_api_key_here
   CLAUDE_MODEL=claude-3-5-sonnet-20241022
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-app.vercel.app`

### Automatic Deployments

Vercel automatically deploys:

- Production: commits to `main` branch
- Preview: commits to other branches and PRs

## Docker Deployment

Deploy using Docker for maximum flexibility.

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Update next.config.js

Add standalone output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  turbopack: {},
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
```

### Build and Run

```bash
# Build image
docker build -t iac-converter .

# Run container
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your_key_here \
  -e CLAUDE_MODEL=claude-3-5-sonnet-20241022 \
  iac-converter
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - CLAUDE_MODEL=claude-3-5-sonnet-20241022
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## AWS Deployment

Deploy to AWS EC2 using Docker.

### Prerequisites

- AWS account
- EC2 instance (t3.small or larger)
- Security group allowing ports 80, 443, and 22

### Steps

1. **Launch EC2 Instance**
   - AMI: Amazon Linux 2023 or Ubuntu 22.04
   - Instance type: t3.small (minimum)
   - Storage: 20 GB
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect to Instance**

   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

3. **Install Docker**

   For Amazon Linux 2023:

   ```bash
   sudo yum update -y
   sudo yum install docker -y
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   ```

   For Ubuntu:

   ```bash
   sudo apt update
   sudo apt install docker.io -y
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ubuntu
   ```

4. **Install Docker Compose**

   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

5. **Clone Repository**

   ```bash
   git clone your-repo-url
   cd iac-converter
   ```

6. **Create Environment File**

   ```bash
   echo "ANTHROPIC_API_KEY=your_key" > .env.local
   ```

7. **Build and Run**

   ```bash
   docker-compose up -d
   ```

8. **Setup Nginx (Optional)**

   For SSL and domain:

   ```bash
   sudo apt install nginx certbot python3-certbot-nginx -y
   ```

   Create `/etc/nginx/sites-available/iac-converter`:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:

   ```bash
   sudo ln -s /etc/nginx/sites-available/iac-converter /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

   Get SSL certificate:

   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Environment Variables

### Required

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)

### Optional

- `CLAUDE_MODEL`: Claude model to use (default: `claude-3-5-sonnet-20241022`)
- `NODE_ENV`: Environment mode (`development` or `production`)
- `PORT`: Server port (default: `3000`)

## Health Checks

Your application exposes these endpoints for monitoring:

- `GET /`: Main application (should return 200)
- `GET /api/health`: Health check endpoint (to be implemented)

## Monitoring

### Vercel

Vercel provides built-in analytics:

- Real-time logs in dashboard
- Function invocation metrics
- Error tracking

### Docker/AWS

Use these tools for monitoring:

- **Application Logs**:

  ```bash
  docker logs -f container-id
  ```

- **CloudWatch** (AWS):
  Install CloudWatch agent for metrics and logs

- **Uptime Monitoring**:
  Use services like UptimeRobot or Pingdom

## Scaling

### Vercel

- Automatically scales
- Zero configuration needed

### Docker/AWS

For high traffic:

1. **Load Balancer**: Use AWS ALB
2. **Auto Scaling**: Create Auto Scaling Group
3. **Container Orchestration**: Use ECS or EKS
4. **Database**: If you add persistence, use RDS
5. **Caching**: Add CloudFront CDN

## Security

### Production Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Set strong firewall rules
- [ ] Keep dependencies updated
- [ ] Enable DDoS protection
- [ ] Implement rate limiting
- [ ] Regular security audits
- [ ] Monitor for vulnerabilities

### API Key Security

- Never commit `.env.local` or `.env` files
- Use environment variables in production
- Rotate API keys regularly
- Implement API rate limiting

## Backup

For production deployments:

1. **Code**: Keep in version control (GitHub)
2. **Configuration**: Document all environment variables
3. **API Keys**: Store securely (e.g., AWS Secrets Manager)

## Rollback

If deployment fails:

### Vercel

- Go to Deployments in dashboard
- Click "Promote to Production" on previous working deployment

### Docker

```bash
docker-compose down
git checkout previous-working-commit
docker-compose up -d --build
```

## Cost Optimization

### Vercel

- Free tier: Generous limits for personal projects
- Pro: $20/month for production apps

### AWS

- t3.small: ~$15/month
- t3.micro (free tier): Good for testing
- Use spot instances for 70% savings

### API Costs

- Claude API: Pay per token
- Optimize by caching results
- Set usage limits in Anthropic console

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Container Won't Start

```bash
# Check logs
docker logs container-id

# Verify environment variables
docker exec container-id env
```

### High Memory Usage

- Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=2048"`
- Use larger instance type
- Implement caching

## Support

For deployment issues:

1. Check application logs
2. Verify environment variables
3. Test locally with `npm run build && npm start`
4. Review platform-specific documentation

## Next Steps

After deployment:

1. Set up monitoring and alerts
2. Configure backups
3. Implement CI/CD pipeline
4. Add custom domain
5. Set up analytics
