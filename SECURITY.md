# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of IaC Converter seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

- Email: security@your-domain.com (replace with actual email)
- GitHub Security Advisories: Use the "Report a vulnerability" button in the Security tab

### What to Include

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit/direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: We will acknowledge your email within 48 hours
- **Status Update**: We will provide a more detailed response within 7 days
- **Fix Timeline**: We aim to release a fix within 30 days for critical vulnerabilities
- **Disclosure**: Once a fix is released, we will publicly disclose the vulnerability

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission of the account holder
- Do not exploit a security issue for any purpose other than verifying it
- Give us reasonable time to resolve the issue before any public disclosure

## Security Measures

### API Key Protection

- API keys are stored in environment variables (never in code)
- API calls are made server-side only (keys never exposed to client)
- Local storage is used only for user preferences (never for API keys in production)
- API keys should be rotated regularly

### Data Handling

- User input is validated and sanitized on both client and server
- File uploads are restricted by type and size
- No user data is stored on our servers (everything is client-side)
- Conversion history is stored in browser localStorage only

### Dependencies

- We regularly update dependencies to patch known vulnerabilities
- Dependabot alerts are enabled for automatic security updates
- We review and test all dependency updates before merging

### Infrastructure

- All API communication happens over HTTPS
- Environment variables are properly configured in deployment environments
- We follow OWASP security best practices

### Code Security

- Input validation on all API endpoints
- Content Security Policy (CSP) headers configured
- XSS protection enabled
- CSRF protection for state-changing operations

## Security Best Practices for Users

### API Key Management

1. **Never commit API keys to version control**
   - Use `.env.local` for development
   - Add `.env*.local` to `.gitignore`
   - Use environment variables in production

2. **Rotate API keys regularly**
   - Set up a rotation schedule (e.g., every 90 days)
   - Rotate immediately if a key is compromised

3. **Use separate keys for different environments**
   - Development keys
   - Staging keys
   - Production keys

### Deployment Security

1. **Use environment variables in production**

   ```bash
   # Vercel
   vercel env add ANTHROPIC_API_KEY

   # Docker
   docker run -e ANTHROPIC_API_KEY=xxx iac-converter
   ```

2. **Enable security headers**
   - Configure appropriate CSP headers
   - Enable HSTS
   - Set X-Frame-Options

3. **Monitor API usage**
   - Set up alerts for unusual API activity
   - Monitor Anthropic console for usage patterns
   - Set rate limits if possible

### Input Validation

1. **Validate file uploads**
   - Check file types before uploading
   - Respect file size limits
   - Scan files for malware if handling sensitive diagrams

2. **Review generated code**
   - Always review generated IaC code before deploying
   - Understand what resources will be created
   - Check for potential security misconfigurations

## Known Security Considerations

### Client-Side Storage

- Conversion history is stored in browser localStorage
- This data persists until manually cleared
- Consider this when using shared or public computers
- Clear history regularly on shared devices

### Generated Code

- Generated IaC code should always be reviewed before deployment
- We cannot guarantee that generated code follows all security best practices
- Add additional security measures as needed:
  - Encryption at rest
  - Network security rules
  - Access controls
  - Audit logging

### API Integration

- Claude API calls may contain your infrastructure descriptions
- Review Anthropic's privacy policy and data handling practices
- Consider data residency requirements for sensitive workloads

## Compliance

We aim to comply with:

- OWASP Top 10 security standards
- General Data Protection Regulation (GDPR) principles
- SOC 2 Type II requirements (where applicable)

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1) and communicated through:

- GitHub Security Advisories
- Release notes in CHANGELOG.md
- GitHub Releases page

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Anthropic Security Practices](https://www.anthropic.com/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)

## Questions?

If you have questions about security that are not covered here:

- Check our documentation
- Review existing security advisories
- Contact us via the security email address above

Thank you for helping keep IaC Converter and our users safe!
