# 🔒 Security Best Practices Guide

## Exposed Secrets Fix & Prevention

This guide addresses the GitGuardian security alerts and provides best practices for handling secrets in your CrackerShop project.

---

## ⚠️ Issues Found & Fixed

### MongoDB Atlas Credentials Exposure
**Files affected:**
- `docs/guides/MULTI_USER_QUICK_START.md` (Line 78)
- `docs/deployment/MULTI_USER_PRODUCTION_GUIDE.md` (Line 133)
- `docs/deployment/PRODUCTION_DEPLOYMENT_COMPLETE.md` (Line 63)

**Fix Applied:**
All actual MongoDB URIs have been replaced with placeholder syntax:
```env
# ❌ BEFORE (Exposed - DO NOT USE)
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/CrackerShop

# ✅ AFTER (Safe)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/CrackerShop
```

---

## 🛡️ Prevention Guidelines

### 1. Never Commit Secrets to Git

**What NOT to do:**
```env
# ❌ NEVER commit these
API_KEY=sk_live_abc123xyz789
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=my-super-secret-key
CLOUDINARY_API_SECRET=secret123
```

### 2. Use Environment Variables Correctly

**Proper Setup:**

```bash
# Create .env file (Add to .gitignore)
MONGO_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/CrackerShop
CLOUDINARY_API_KEY=your_actual_key
CLOUDINARY_API_SECRET=your_actual_secret
JWT_SECRET=your_secret_key
```

**Backend (server.js):**
```javascript
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
const cloudinaryKey = process.env.CLOUDINARY_API_KEY;
```

### 3. .gitignore Configuration

Ensure your `.gitignore` includes:
```
.env
.env.local
.env.*.local
*.pem
*.key
secrets/
config/local*
```

### 4. Documentation Best Practices

When writing documentation:

**❌ INCORRECT - Shows real secrets:**
```markdown
MONGO_URI=mongodb+srv://admin:Pass123@production.mongodb.net/db
API_KEY=sk_live_1234567890abcdef
```

**✅ CORRECT - Uses placeholders:**
```markdown
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
API_KEY=<your_api_key_here>
```

---

## 🔐 Secure Credential Rotation

### If You Accidentally Exposed Credentials:

1. **Immediately rotate all credentials:**
   - MongoDB Atlas: Change database user password
   - Cloudinary: Regenerate API keys
   - JWT: Update JWT_SECRET in .env

2. **Remove from Git history:**
```bash
# Remove specific file from history
git filter-branch --tree-filter 'rm -f .env' HEAD

# Or use git-filter-repo (recommended)
git filter-repo --path .env --invert-paths
```

3. **Force push (⚠️ Use with caution):**
```bash
git push --force-with-lease origin main
```

4. **Audit access logs:**
   - Check MongoDB Atlas connection logs
   - Review Cloudinary API usage
   - Monitor unauthorized access attempts

---

## 📋 Environment Variables Checklist

### Backend Variables (.env)
- [ ] `MONGO_URI` - MongoDB Atlas URI
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary secret (never expose)
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `JWT_EXPIRE` - JWT expiration time
- [ ] `ADMIN_EMAIL` - Admin email address
- [ ] `NODE_ENV` - Environment (development/production)

### Frontend Variables (.env or environment.js)
- [ ] `REACT_APP_API_URL` - Backend API URL (public)
- [ ] `EXPO_PUBLIC_API_URL` - API URL for React Native
- [ ] NO sensitive keys should be in frontend!

---

## 🔑 MongoDB Atlas Security

### Best Practices:

1. **Create a database user specifically for the app:**
```
Username: crackershop_app
Password: Strong password (20+ chars, mix of upper/lower/numbers/symbols)
```

2. **Restrict network access:**
   - Set IP whitelist to your server IPs only
   - Use VPC peering if available

3. **Enable encryption:**
   - Encryption at rest: ✅ (Default)
   - TLS/SSL: ✅ (Enforce)

4. **Regular backups:**
```bash
# Automated backup every 6 hours via MongoDB Atlas
# Manual backup when needed
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/database"
```

---

## 🚀 GitHub Security Settings

### 1. Enable Secret Scanning
- Go to Settings → Security & analysis
- Enable "Secret scanning"
- Enable "Push protection"

### 2. Branch Protection
```
Settings → Branches → Add Rule
- Require status checks to pass before merging
- Require code reviews before merging
- Dismiss stale pull request approvals
```

### 3. Dependabot Updates
- Automatically update vulnerable dependencies
- Review and approve security updates

---

## 🔍 Scanning for Exposed Secrets

### Local Scanning Tools

```bash
# Install git-secrets
brew install git-secrets

# Configure patterns
git secrets --install
git secrets --register-aws

# Scan before commit
git secrets --scan

# Add custom patterns
git config --global secrets.patterns '(password|api_key|secret) = .*'
```

### Third-party Services

- **GitGuardian**: Continuous scanning (free tier available)
- **Snyk**: Vulnerability and secret scanning
- **OWASP Dependency-Check**: Vulnerability scanning

---

## ✅ Verification Steps

After implementing security fixes:

1. **Verify .gitignore is working:**
```bash
git check-ignore -v .env
```

2. **Scan for secrets in history:**
```bash
git log --all -p -S "MONGO_URI=" | head -20
```

3. **Check environment variables:**
```bash
# Backend
echo $MONGO_URI  # Should show actual value locally
echo $JWT_SECRET

# Should NOT see in: git log, GitHub, commits, PRs
```

4. **Test with example credentials:**
- Use dummy MongoDB user in tests
- Use mock API keys in development

---

## 📚 Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [MongoDB Atlas Security](https://docs.mongodb.com/manual/security/)
- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitGuardian Documentation](https://docs.gitguardian.com/)

---

## 🎯 Summary

✅ **Done:**
- Replaced all exposed MongoDB URIs with placeholders
- Added security warnings to documentation
- Configured .gitignore properly

⏭️ **Next Steps:**
- Rotate your MongoDB Atlas credentials
- Review and update API keys
- Enable GitHub secret scanning
- Implement local secret scanning tools

**Remember:** Never commit secrets. Use environment variables and `.gitignore` always!
