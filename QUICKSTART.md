# Quick Start Guide

Get your IaC Converter up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure API Key

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

**Important**: Never commit your `.env.local` file!

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Test Text-to-IaC Conversion

1. Select **Text** input type
2. Choose **AWS** as the cloud provider
3. Select **Terraform** as the output format
4. Paste this example:

```
Create a simple web application with:
- Application Load Balancer
- Auto Scaling Group with 2-4 EC2 t3.small instances
- RDS MySQL database
- VPC with public and private subnets
```

5. Click **Convert to IaC**

You should see generated Terraform code in the output panel!

## Step 5: Test Image-to-IaC Conversion

1. Select **Image** input type
2. Upload an architecture diagram (or drag and drop)
3. Select your cloud provider and formats
4. Click **Convert to IaC**

## Step 6: Explore Templates

Click the **Templates** button in the header to browse pre-built templates for common infrastructure patterns like:

- Web applications
- Serverless APIs
- Kubernetes clusters
- Data pipelines
- And more!

## Production Build

To create a production build:

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add `ANTHROPIC_API_KEY` in environment variables
5. Deploy!

## Troubleshooting

### API Key Not Working

Make sure:

- You've created `.env.local` (not `.env`)
- Your API key starts with `sk-ant-`
- You've restarted the dev server after adding the key

### Build Errors

Try:

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Image Upload Issues

Check that:

- Image is under 5MB
- Image format is JPEG, PNG, GIF, or WebP

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [EXAMPLES.md](EXAMPLES.md) for more usage examples
- Customize the templates in `lib/templates.ts`
- Adjust styling in `app/globals.css`

## Support

Having issues? Check the documentation or open an issue on GitHub.

Happy infrastructure coding! 🚀
