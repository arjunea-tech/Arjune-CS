# Quick Reference: .env Files & Git Configuration

## 🎯 Three .env Files at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                     .env FILES HIERARCHY                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  .env.example (📄 COMMITTED TO GIT)                          │
│  └─ Safe template with placeholder values                    │
│     └─ Shows all required variables                          │
│        └─ Share with team                                    │
│           └─ Update when adding new vars                     │
│                                                               │
│              ↓ (Each person creates)                          │
│                                                               │
│  .env (🔒 IGNORED BY GIT)                                    │
│  └─ Local development configuration                          │
│     └─ Your actual local secrets                             │
│        └─ Never commit to git                                │
│           └─ Different values than production                │
│                                                               │
│              ↓ (Only deployment team)                         │
│                                                               │
│  .env.production (🔐 IGNORED BY GIT)                         │
│  └─ Production server configuration                          │
│     └─ Real production secrets                               │
│        └─ Never share via email/chat                         │
│           └─ Handle with maximum security                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 .env Files Comparison Table

```
ASPECT                  │ .env          │ .env.example   │ .env.production
────────────────────────┼───────────────┼────────────────┼─────────────────
Purpose                 │ Local dev     │ Team template  │ Production
Who Has It              │ Only you      │ Everyone       │ Prod admin
Should Commit to Git    │ ❌ NO         │ ✅ YES         │ ❌ NO
Contains Real Secrets   │ ✅ YES        │ ❌ NO          │ ✅ YES
Needs Updates When      │ You customize │ Vars change    │ Prod deploy
Location                │ backend/      │ backend/       │ backend/
When to Create          │ cp from ex.   │ Already there  │ Manual setup
────────────────────────┴───────────────┴────────────────┴─────────────────
```

---

## 🛡️ Git Protection Flow

```
┌──────────────────────────────────────┐
│     Your Local Files                  │
├──────────────────────────────────────┤
│                                       │
│  .env              🔒 PROTECTED       │
│  .env.production   🔒 PROTECTED       │
│  .env.example      ✅ COMMITTED       │
│  source code/      ✅ COMMITTED       │
│  config.js         ✅ COMMITTED       │
│  .gitignore        ✅ COMMITTED       │
│  package.json      ✅ COMMITTED       │
│                                       │
└─────────────┬──────────────────────────┘
              │
              ↓ (git status)
              
              Git Repository 
              
        What's visible on GitHub:
        ✅ .env.example (safe)
        ✅ Source code
        ✅ .gitignore
        
        What's NOT visible:
        🔒 .env (protected)
        🔒 .env.production (protected)
        🔒 node_modules (ignored)
        🔒 logs (ignored)
```

---

## 🔐 Security Layers

```
LAYER 1: .gitignore (Local)
├─ Defines what gets ignored
└─ Prevents accidental commits

LAYER 2: .env Files (Local)
├─ .env & .env.production NOT in git
├─ .env.example only in git
└─ Secrets stay local

LAYER 3: Access Control (Production)
├─ Only deployment team has .env.production
├─ Use secure vaults for credential storage
└─ Limited server access via SSH keys

LAYER 4: Secret Rotation (Ongoing)
├─ Rotate JWT_SECRET periodically
├─ Update database passwords quarterly
└─ Review access logs regularly
```

---

## 📝 When to Do What

```
SCENARIO: Starting Local Development
├─ 1. Clone repository
├─ 2. Run: cp .env.example .env
├─ 3. Edit .env with your local values
├─ 4. Run: npm install && npm start
└─ ✅ Never commit .env

SCENARIO: Adding New Environment Variable
├─ 1. Add to .env.example (with placeholder)
├─ 2. Add to .env (with actual value)
├─ 3. Add to .env.production (prod value)
├─ 4. Use: process.env.VARIABLE_NAME
├─ 5. Commit .env.example only
└─ ✅ .env & .env.production stay local

SCENARIO: New Team Member Joins
├─ 1. Send them .env.example link
├─ 2. They clone repository
├─ 3. They run: cp .env.example .env
├─ 4. You provide actual secrets via secure channel
├─ 5. They add secrets to their .env
├─ 6. They run: npm install && npm start
└─ ✅ No .env shared via message/email

SCENARIO: Deploying to Production
├─ 1. SSH into production server
├─ 2. Clone repository
├─ 3. Create .env.production with prod secrets
├─ 4. Run: npm install
├─ 5. Run: NODE_ENV=production npm start
└─ ✅ .env.production never committed

SCENARIO: Accidentally Committed Secrets
├─ 1. STOP everything
├─ 2. Run: git rm --cached .env
├─ 3. Update .gitignore to include .env
├─ 4. Regenerate all exposed secrets
├─ 5. Force push to remove from history
└─ ⚠️ Compromised secrets are invalid now
```

---

## 🔍 Checking Your Setup

```bash
# Verify .env is NOT tracked by git
git status
# Should NOT show .env file

# Check .gitignore has .env
cat .gitignore | grep .env
# Should show .env listed

# Verify .env exists but ignored
ls -la backend/.env
# Should show file exists

# See what git would commit
git status
# .env should not appear in list

# Verify .env.example is tracked
git ls-files | grep .env.example
# Should show .env.example is tracked
```

---

## ⚡ Fast Reference Commands

```bash
# SETUP
cp backend/.env.example backend/.env

# VERIFY
git status                          # Check .env is ignored
cat backend/.env | head -5          # View first 5 lines
git ls-files | grep .env            # List tracked .env files

# ADD NEW VARIABLE
# 1. Edit .env.example (add with placeholder)
# 2. Edit .env (add with actual value)
# 3. Edit .env.production (add with prod value)
# 4. Use in code: process.env.NEW_VAR

# COMMIT CHANGES
git add .env.example                # Track template only
git commit -m "Add new env variables to .env.example"

# DEPLOY
# Copy .env.example to .env.production on prod server
# Edit with production secrets
# npm start
```

---

## 🚨 Common Mistakes to Avoid

```
❌ MISTAKE 1: Committing .env to git
✅ FIX: Add to .gitignore, regenerate all secrets

❌ MISTAKE 2: Sharing .env.production in chat
✅ FIX: Use secure vault, only admin access

❌ MISTAKE 3: Using same secret for dev & prod
✅ FIX: Different .env.production with new secrets

❌ MISTAKE 4: Hardcoding secrets in code
✅ FIX: Always use process.env.SECRET_NAME

❌ MISTAKE 5: Not updating .env.example
✅ FIX: Update immediately when adding variables

❌ MISTAKE 6: Leaving .env.example with real secrets
✅ FIX: Always use placeholders in .env.example

❌ MISTAKE 7: Assuming .env.example has secrets
✅ FIX: Verify it's safe to commit before pushing
```

---

## 📌 Memory Tricks

```
.env        → "Environment" (yours locally)
             Keep SAFE, keep LOCAL, keep SECRET
             
.env.example → "Example" (for everyone)
              Keep OPEN, keep COMMITTED, keep SAFE
              
.env.production → "Production" (for admins)
                  Keep LOCKED, keep LOCAL, keep SECURE
```

---

## 🎓 Learning Path

1. **Start Here:** Read `ENV_CONFIGURATION.md`
2. **Deep Dive:** Read `BACKEND_ENV_GUIDE.md`
3. **Reference:** Use this document for quick lookup
4. **Troubleshoot:** Check `TROUBLESHOOTING_MANAGEBOUTUS_ERROR.md`
5. **Practice:** Follow setup instructions for team members

---

## 📞 Support Reference

| Issue | Read |
|-------|------|
| "Why not commit .env?" | BACKEND_ENV_GUIDE.md #security |
| "How to add new variable?" | ENV_CONFIGURATION.md #adding-new |
| "Setup for team member?" | BACKEND_ENV_GUIDE.md #setup-instructions |
| "Production deployment?" | BACKEND_ENV_GUIDE.md #for-production-deployment |
| "Error on component?" | TROUBLESHOOTING_MANAGEBOUTUS_ERROR.md |

---

**Print this page or bookmark for quick reference! 📌**

Last Updated: January 23, 2026
