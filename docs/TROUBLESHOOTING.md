# Troubleshooting Guide

This guide helps you resolve common issues with IaC Converter.

## Table of Contents

- [Installation Issues](#installation-issues)
- [API Key Issues](#api-key-issues)
- [Conversion Issues](#conversion-issues)
- [Image Upload Issues](#image-upload-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [Performance Issues](#performance-issues)
- [Browser Issues](#browser-issues)

---

## Installation Issues

### Issue: `npm install` fails

**Symptoms**:

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**:

1. **Clear npm cache**:

   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use correct Node.js version**:

   ```bash
   node --version  # Should be 18.x or higher
   ```

   If not, install Node.js 18+: https://nodejs.org/

3. **Try legacy peer deps**:
   ```bash
   npm install --legacy-peer-deps
   ```

### Issue: TypeScript errors after installation

**Symptoms**:

```
Cannot find module '@types/react' or its corresponding type declarations
```

**Solutions**:

1. **Reinstall TypeScript types**:

   ```bash
   npm install --save-dev @types/react @types/react-dom @types/node
   ```

2. **Check TypeScript version**:
   ```bash
   npx tsc --version  # Should be 5.x
   ```

---

## API Key Issues

### Issue: "API key not configured" error

**Symptoms**:

- Error message when trying to convert
- 401 Unauthorized responses from API

**Solutions**:

1. **Check `.env.local` file exists**:

   ```bash
   ls -la .env.local
   ```

2. **Verify API key format**:

   ```bash
   # .env.local should contain:
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
   ```

3. **Restart development server**:

   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

4. **Verify API key is valid**:
   - Go to https://console.anthropic.com/
   - Check that your API key is active
   - Regenerate if necessary

### Issue: API key works locally but not in production

**Solutions**:

1. **For Vercel deployment**:

   ```bash
   vercel env add ANTHROPIC_API_KEY
   # Enter your API key when prompted
   ```

2. **Redeploy after adding environment variable**:

   ```bash
   vercel --prod
   ```

3. **Check environment variable in Vercel dashboard**:
   - Go to Project Settings → Environment Variables
   - Ensure `ANTHROPIC_API_KEY` is set for Production

---

## Conversion Issues

### Issue: Conversion fails with "Failed to convert" error

**Symptoms**:

- API returns 500 error
- Generic "Failed to convert" message

**Solutions**:

1. **Check input clarity**:
   - Be more specific in your description
   - Include resource types, sizes, and configurations
   - Specify cloud provider explicitly

   **Good**:

   ```
   Create an AWS web application with:
   - Application Load Balancer
   - 3 EC2 t3.medium instances
   - RDS MySQL database
   - Deploy in us-east-1
   ```

   **Bad**:

   ```
   Create a web app
   ```

2. **Check Claude API status**:
   - Visit https://status.anthropic.com/
   - Wait if there's an outage

3. **Try a simpler request first**:
   - Test with a basic infrastructure description
   - Gradually add complexity

### Issue: Generated code is incomplete or incorrect

**Solutions**:

1. **Provide more details**:
   - Add specific configurations
   - Include networking requirements
   - Specify security requirements

2. **Try different output format**:
   - Some formats may work better for certain architectures
   - Try Terraform first (most comprehensive)

3. **Use templates as starting points**:
   - Browse the Template Library
   - Start with a template close to your needs
   - Modify the template prompt

### Issue: "Rate limit exceeded" error

**Symptoms**:

```
Error: Rate limit exceeded. Please try again later.
```

**Solutions**:

1. **Wait before retrying**:
   - Free tier: Wait 1 minute
   - Paid tier: Wait 10-30 seconds

2. **Upgrade Anthropic API plan**:
   - Visit https://console.anthropic.com/
   - Upgrade to a paid plan for higher limits

3. **Batch your requests**:
   - Combine multiple requirements into one request
   - Use multiple output formats in a single call

---

## Image Upload Issues

### Issue: "File too large" error

**Symptoms**:

```
Error: Image size exceeds 5MB limit
```

**Solutions**:

1. **Compress the image**:
   - Use online tools like TinyPNG
   - Or use ImageOptim (macOS) / RIOT (Windows)

2. **Reduce image dimensions**:

   ```bash
   # Using ImageMagick
   convert input.png -resize 50% output.png
   ```

3. **Convert to more efficient format**:
   - Use PNG for diagrams (smaller than JPEG for diagrams)
   - Use JPEG for photos

### Issue: Image upload doesn't work

**Symptoms**:

- Drag-and-drop doesn't respond
- File picker doesn't open
- Image doesn't appear after selection

**Solutions**:

1. **Check browser permissions**:
   - Ensure browser has file access permission
   - Try a different browser

2. **Verify image format**:
   - Supported: JPEG, PNG, GIF, WebP
   - Not supported: BMP, TIFF, SVG

3. **Check browser console for errors**:
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Report errors in GitHub issues

### Issue: Image conversion produces poor results

**Solutions**:

1. **Use higher quality diagrams**:
   - Avoid screenshots of screenshots
   - Use original diagram files
   - Ensure text is legible

2. **Label components clearly**:
   - Add text labels for each component
   - Use standard cloud provider icons
   - Show relationships between components

3. **Simplify the diagram**:
   - Break complex diagrams into smaller parts
   - Convert each part separately
   - Combine results manually

---

## Build and Deployment Issues

### Issue: `npm run build` fails

**Symptoms**:

```
Error: Failed to compile
```

**Solutions**:

1. **Check TypeScript errors**:

   ```bash
   npm run type-check
   ```

   Fix any type errors reported

2. **Check ESLint errors**:

   ```bash
   npm run lint
   ```

   Fix lint errors or warnings

3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run build
   ```

### Issue: Deployment to Vercel fails

**Solutions**:

1. **Check build logs in Vercel dashboard**:
   - Look for specific error messages
   - Address TypeScript/build errors

2. **Ensure environment variables are set**:
   - `ANTHROPIC_API_KEY` must be set in Vercel
   - Add via Vercel dashboard or CLI

3. **Check Node.js version**:
   - Vercel should use Node.js 18+
   - Set in `package.json`:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

### Issue: Application works locally but not in production

**Solutions**:

1. **Check environment variables**:
   - Ensure all required variables are set in production
   - Don't rely on `.env.local` for production

2. **Check API routes**:
   - Ensure API routes are not using localhost URLs
   - Use relative paths: `/api/convert-text`

3. **Check browser console in production**:
   - Look for CORS or network errors
   - Check for missing resources

---

## Performance Issues

### Issue: Conversion is very slow

**Symptoms**:

- Takes more than 30 seconds to convert
- Loading spinner appears for a long time

**Solutions**:

1. **Simplify the request**:
   - Break complex infrastructure into smaller parts
   - Convert in multiple steps

2. **Check network connection**:
   - Slow internet can delay API calls
   - Try from a different network

3. **Check Claude API status**:
   - Visit https://status.anthropic.com/
   - Delays may be on Anthropic's side

### Issue: Application is slow to load

**Solutions**:

1. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Clear cache in browser settings

2. **Disable browser extensions**:
   - Try in incognito/private mode
   - Disable ad blockers temporarily

3. **Check build optimization**:
   ```bash
   npm run build
   npm start
   # Test production build locally
   ```

---

## Browser Issues

### Issue: Application doesn't work in Safari

**Solutions**:

1. **Update Safari**:
   - Ensure you're using Safari 16+
   - Update macOS if needed

2. **Enable JavaScript**:
   - Safari → Settings → Security
   - Ensure "Enable JavaScript" is checked

3. **Clear Safari cache**:
   - Safari → Settings → Privacy → Manage Website Data
   - Remove data for the site

### Issue: Monaco Editor doesn't load

**Symptoms**:

- Code editor area is blank
- No syntax highlighting

**Solutions**:

1. **Check browser compatibility**:
   - Use Chrome, Firefox, Safari, or Edge
   - Update to the latest version

2. **Disable browser extensions**:
   - Some extensions block Monaco Editor
   - Try in incognito mode

3. **Check console for errors**:
   - Open DevTools (F12)
   - Look for loading errors
   - Report in GitHub issues

---

## Debug Mode

To enable verbose logging:

1. **Open browser console** (F12)

2. **Enable debug mode**:

   ```javascript
   localStorage.setItem("debug", "true");
   location.reload();
   ```

3. **Check detailed logs**:
   - API requests and responses
   - Component lifecycle
   - State changes

4. **Disable debug mode**:
   ```javascript
   localStorage.removeItem("debug");
   location.reload();
   ```

---

## Getting Help

If you can't resolve your issue:

1. **Search existing issues**:
   - https://github.com/yourusername/iac-converter/issues
   - Your issue may already be reported

2. **Create a new issue**:
   - Use the bug report template
   - Include:
     - Steps to reproduce
     - Expected vs actual behavior
     - Screenshots
     - Browser and OS details
     - Error messages from console

3. **Provide diagnostic information**:
   ```bash
   # Run these commands and include output in issue
   node --version
   npm --version
   npm list --depth=0
   ```

---

## Common Error Messages

| Error Message            | Likely Cause              | Solution                       |
| ------------------------ | ------------------------- | ------------------------------ |
| "API key not configured" | Missing/invalid API key   | Check `.env.local` file        |
| "Failed to convert"      | Claude API error          | Check input clarity, try again |
| "File too large"         | Image > 5MB               | Compress image                 |
| "Invalid provider"       | Typo in provider name     | Use "aws", "azure", or "gcp"   |
| "Invalid format"         | Unsupported output format | Check supported formats        |
| "Rate limit exceeded"    | Too many requests         | Wait and retry                 |
| "Network error"          | No internet connection    | Check network connection       |
| "Timeout"                | Request took too long     | Simplify request, try again    |

---

## Still Having Issues?

1. Check the [README](../README.md) for setup instructions
2. Review the [API Documentation](./API.md) for API details
3. Visit our [GitHub Discussions](https://github.com/yourusername/iac-converter/discussions)
4. Open an [issue](https://github.com/yourusername/iac-converter/issues) with details

---

## Useful Links

- [Anthropic API Status](https://status.anthropic.com/)
- [Anthropic Documentation](https://docs.anthropic.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
