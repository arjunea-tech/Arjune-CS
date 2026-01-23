# Environment Configuration Guide

## Backend .env Files Overview

Your CrackerShop project has **three important .env files** in the `backend/` directory:

### 1. **.env** (Development/Local Environment)
**Purpose:** Used during local development  
**When to use:** When running the project locally with `npm start` or `npm run dev`  
**Key settings:**
- `NODE_ENV=production` - Set to production for stability
- `MONGO_URI=mongodb://localhost:27017/crackershop` - Local MongoDB
- `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,http://192.168.1.37:8081` - Local origins
- Log level: `debug` for verbose logging
- Rate limiting: More relaxed (100 requests)

**When NOT to commit:** ❌ This file is in .gitignore for security

---

### 2. **.env.example** (Template File)
**Purpose:** Safe template for team members and deployment  
**When to use:** Reference for what variables are needed  
**Key characteristics:**
- Contains all required variables with placeholder values
- Safe to commit to git ✅
- No actual secrets or credentials
- Used as a template: `cp .env.example .env`

**Important:** Keep this updated whenever you add new environment variables

---

### 3. **.env.production** (Production Environment)
**Purpose:** Used when deploying to production  
**When to use:** When running with `NODE_ENV=production` in production servers  
**Key settings:**
- `NODE_ENV=production` - Production mode enabled
- Stricter rate limiting (1000 requests)
- Production database URI
- Production CORS origins
- Enhanced logging with log files
- Clustering enabled for performance

**When NOT to commit:** ❌ This file is in .gitignore for security

---

## How to Use These Files

### Local Development
```bash
# Copy the example to create your local .env
cp backend/.env.example backend/.env

# Edit .env with your local values
# This file is ignored by git - changes won't be committed
nano backend/.env
```

### Deployment to Production
```bash
# Use .env.production for server deployment
# Make sure all production credentials are set correctly
cp backend/.env.example backend/.env.production
```

### Team Collaboration
```bash
# Share .env.example with team
# Each team member creates their own .env from the example
# .env and .env.production stay local (never committed)
```

---

## Critical Variables Explained

| Variable | Purpose | Keep Secret? |
|----------|---------|--------------|
| `MONGO_URI` | Database connection string | ✅ YES |
| `JWT_SECRET` | Authentication token secret | ✅ YES |
| `CLOUDINARY_API_KEY` | Image hosting credentials | ✅ YES |
| `CLOUDINARY_API_SECRET` | Image hosting secret | ✅ YES |
| `NODE_ENV` | Development/Production mode | ⚠️ Semi-sensitive |
| `ALLOWED_ORIGINS` | CORS allowed domains | ⚠️ Semi-sensitive |
| `PORT` | Server port | ❌ NO |
| `LOG_LEVEL` | Logging verbosity | ❌ NO |

---

## .gitignore Configuration

### What IS Ignored (Protected from git):
```
# Environment files with secrets
.env                    # Local development
.env.local             # Local overrides
.env.production        # Production secrets
.env.*.local           # Any local env variants

# Node dependencies
node_modules/
npm-debug.log*
yarn-debug.log*

# Build outputs
build/
dist/
android/app/build/
ios/build/

# Cache files
.cache/
.tmp/
*.log

# IDE files
.vscode/
.idea/
*.iml

# OS files
.DS_Store
Thumbs.db
```

### What IS Committed (Safe to share):
```
.env.example           # ✅ Safe - template only
package.json           # ✅ Safe - dependencies list
package-lock.json      # ✅ Safe - dependency lock
.gitignore            # ✅ Safe - protection rules
*.md files            # ✅ Safe - documentation
```

---

## Security Best Practices

### ✅ DO:
- Keep `.env` files local (never commit)
- Use `.env.example` as a template
- Rotate JWT_SECRET regularly in production
- Use strong MONGO_URI passwords
- Set different secrets for dev vs production
- Add new variables to `.env.example` immediately

### ❌ DON'T:
- Commit `.env` to repository
- Share production credentials via chat/email
- Use same secrets for dev and production
- Leave sensitive data in logs
- Hardcode credentials in code files

---

## Adding New Environment Variables

When you add a new environment variable:

1. **Add to `.env.example` first:**
   ```env
   NEW_API_KEY=your_key_here
   NEW_API_SECRET=your_secret_here
   ```

2. **Add to `.env` (local):**
   ```env
   NEW_API_KEY=actual_local_key
   NEW_API_SECRET=actual_local_secret
   ```

3. **Add to `.env.production`:**
   ```env
   NEW_API_KEY=actual_production_key
   NEW_API_SECRET=actual_production_secret
   ```

4. **Use in code:**
   ```javascript
   const apiKey = process.env.NEW_API_KEY;
   const apiSecret = process.env.NEW_API_SECRET;
   ```

---

## Troubleshooting

**Problem:** Environment variables not loading
```
Solution: Make sure NODE_ENV matches the file being used
         Restart the server after changing .env
         Check that .env file is in backend/ directory
```

**Problem:** Different behavior in production vs local
```
Solution: Compare .env vs .env.production settings
         Check LOG_LEVEL - production may hide debug info
         Verify MONGO_URI points to correct database
```

**Problem:** Accidentally committed .env file
```
Solution: git rm --cached .env
         Update .gitignore to include .env
         Regenerate all secrets in that file
         Force push to remove from history
```

---

## Summary Table

| File | Commit? | Contains Secrets? | Use Case |
|------|---------|------------------|----------|
| `.env` | ❌ NO | ✅ YES | Local development |
| `.env.example` | ✅ YES | ❌ NO | Team template |
| `.env.production` | ❌ NO | ✅ YES | Production server |
| `.gitignore` | ✅ YES | ❌ NO | Protection rules |

---

**Last Updated:** January 23, 2026  
**For Questions:** Check server.js and config/db.js for how env variables are used
