#!/bin/bash

# CrackerShop Production Readiness Verification Script
# Run this before deploying to production

set -e

echo "🔍 CrackerShop Production Readiness Check"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
pass() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASSED++))
}

fail() {
    echo -e "${RED}✗ $1${NC}"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

# 1. Backend Checks
echo "📦 Backend Checks"
echo "---------------"

# Check backend directory
if [ -d "backend" ]; then
    pass "Backend directory exists"
else
    fail "Backend directory not found"
fi

# Check backend package.json
if [ -f "backend/package.json" ]; then
    pass "backend/package.json exists"
else
    fail "backend/package.json not found"
fi

# Check for required dependencies
cd backend
if grep -q '"express"' package.json && \
   grep -q '"mongoose"' package.json && \
   grep -q '"helmet"' package.json && \
   grep -q '"cors"' package.json; then
    pass "Required dependencies present"
else
    fail "Missing required dependencies"
fi
cd ..

# Check environment files
if [ -f "backend/.env.example" ]; then
    pass "backend/.env.example exists"
else
    fail "backend/.env.example not found"
fi

if [ -f "backend/.env.production" ]; then
    pass "backend/.env.production exists"
    
    # Check if production env has required vars
    if grep -q "MONGO_URI" backend/.env.production && \
       grep -q "JWT_SECRET" backend/.env.production; then
        pass "Production env has required variables"
    else
        fail "Production env missing required variables"
    fi
else
    warn "backend/.env.production not found (create before deployment)"
fi

# Check server.js
if [ -f "backend/server.js" ]; then
    if grep -q "helmet" backend/server.js && \
       grep -q "rate" backend/server.js && \
       grep -q "logger" backend/server.js; then
        pass "server.js has security features"
    else
        warn "server.js might be missing some security features"
    fi
else
    fail "backend/server.js not found"
fi

# Check database config
if [ -f "backend/config/db.js" ]; then
    if grep -q "poolSize\|maxPoolSize" backend/config/db.js; then
        pass "Database connection pooling configured"
    else
        warn "Database connection pooling might not be configured"
    fi
else
    fail "backend/config/db.js not found"
fi

# Check error middleware
if [ -f "backend/middleware/error.js" ]; then
    pass "Error middleware exists"
else
    warn "Error middleware not found"
fi

# Check logger
if [ -f "backend/utils/logger.js" ]; then
    pass "Logger utility exists"
else
    warn "Logger utility not found"
fi

# Check validation
if [ -f "backend/utils/validation.js" ]; then
    pass "Validation utility exists"
else
    warn "Validation utility not found"
fi

# 2. Frontend Checks
echo ""
echo "📱 Frontend Checks"
echo "---------------"

# Check frontend directory
if [ -d "frontend" ]; then
    pass "Frontend directory exists"
else
    fail "Frontend directory not found"
fi

# Check frontend package.json
if [ -f "frontend/package.json" ]; then
    pass "frontend/package.json exists"
else
    fail "frontend/package.json not found"
fi

# Check environment config
if [ -f "frontend/environment.js" ]; then
    if grep -q "prod:" frontend/environment.js || grep -q "production" frontend/environment.js; then
        pass "Frontend environment configuration exists"
    else
        warn "Frontend production environment not configured"
    fi
else
    warn "frontend/environment.js not found"
fi

# Check error boundary
if [ -f "frontend/Components/utils/ErrorBoundary.jsx" ]; then
    pass "Error boundary component exists"
else
    warn "Error boundary component not found"
fi

# Check API service
if [ -f "frontend/Components/api/apiService.js" ]; then
    pass "API service exists"
else
    warn "API service not found"
fi

# 3. Infrastructure Checks
echo ""
echo "🏗️  Infrastructure Checks"
echo "------------------------"

# Check Docker files
if [ -f "backend/Dockerfile" ]; then
    pass "backend/Dockerfile exists"
else
    warn "backend/Dockerfile not found"
fi

if [ -f "docker-compose.yml" ]; then
    pass "docker-compose.yml exists"
else
    warn "docker-compose.yml not found"
fi

# Check Nginx config
if [ -f "nginx.conf" ]; then
    pass "nginx.conf exists"
    
    if grep -q "ssl_certificate\|https" nginx.conf; then
        pass "Nginx has SSL configuration"
    else
        warn "Nginx SSL configuration might be incomplete"
    fi
else
    warn "nginx.conf not found"
fi

# 4. Documentation Checks
echo ""
echo "📚 Documentation Checks"
echo "---------------------"

# Check main README
if [ -f "README.md" ]; then
    pass "README.md exists"
else
    fail "README.md not found"
fi

# Check backend deployment guide
if [ -f "backend/PRODUCTION_DEPLOYMENT.md" ]; then
    pass "Backend deployment guide exists"
else
    warn "backend/PRODUCTION_DEPLOYMENT.md not found"
fi

# Check frontend build guide
if [ -f "frontend/PRODUCTION_BUILD_GUIDE.md" ]; then
    pass "Frontend build guide exists"
else
    warn "frontend/PRODUCTION_BUILD_GUIDE.md not found"
fi

# Check deployment checklist
if [ -f "DEPLOYMENT_CHECKLIST.md" ]; then
    pass "Deployment checklist exists"
else
    warn "DEPLOYMENT_CHECKLIST.md not found"
fi

# Check monitoring guide
if [ -f "MONITORING_GUIDE.md" ]; then
    pass "Monitoring guide exists"
else
    warn "MONITORING_GUIDE.md not found"
fi

# 5. Security Checks
echo ""
echo "🔒 Security Checks"
echo "------------------"

# Check for hardcoded credentials
if grep -r "password\|secret\|key" backend/server.js 2>/dev/null | grep -q "=\s*['\"]"; then
    warn "Possible hardcoded credentials in server.js"
else
    pass "No obvious hardcoded credentials"
fi

# Check env files in gitignore
if [ -f ".gitignore" ]; then
    if grep -q "\.env" .gitignore; then
        pass ".env files in .gitignore"
    else
        fail ".env files NOT in .gitignore (security risk!)"
    fi
else
    warn ".gitignore not found"
fi

# 6. Dependencies Checks
echo ""
echo "📦 Dependencies Checks"
echo "---------------------"

# Check if npm is installed
if command -v npm &> /dev/null; then
    pass "npm is installed"
    npm_version=$(npm -v)
    pass "npm version: $npm_version"
else
    fail "npm is not installed"
fi

# Check if node is installed
if command -v node &> /dev/null; then
    pass "Node.js is installed"
    node_version=$(node -v)
    pass "Node.js version: $node_version"
else
    fail "Node.js is not installed"
fi

# Check backend node_modules
if [ -d "backend/node_modules" ]; then
    pass "Backend dependencies installed"
else
    warn "Backend dependencies not installed (run: npm install in backend/)"
fi

# Check frontend node_modules
if [ -d "frontend/node_modules" ]; then
    pass "Frontend dependencies installed"
else
    warn "Frontend dependencies not installed (run: npm install in frontend/)"
fi

# 7. Configuration Checks
echo ""
echo "⚙️  Configuration Checks"
echo "---------------------"

# Check Docker is installed
if command -v docker &> /dev/null; then
    pass "Docker is installed"
else
    warn "Docker is not installed (needed for containerization)"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    pass "Docker Compose is installed"
else
    warn "Docker Compose is not installed"
fi

# Check for setup script
if [ -f "setup-production.sh" ]; then
    pass "Production setup script exists"
else
    warn "setup-production.sh not found"
fi

# 8. API Endpoints Check
echo ""
echo "🔌 API Structure Check"
echo "---------------------"

# Check routes directory
if [ -d "backend/routes" ]; then
    route_count=$(ls backend/routes/*.js 2>/dev/null | wc -l)
    if [ $route_count -gt 0 ]; then
        pass "API routes configured ($route_count route files)"
    else
        fail "No route files found"
    fi
else
    fail "backend/routes directory not found"
fi

# Check controllers directory
if [ -d "backend/controllers" ]; then
    controller_count=$(ls backend/controllers/*.js 2>/dev/null | wc -l)
    if [ $controller_count -gt 0 ]; then
        pass "Controllers configured ($controller_count controller files)"
    else
        fail "No controller files found"
    fi
else
    fail "backend/controllers directory not found"
fi

# Check models directory
if [ -d "backend/models" ]; then
    model_count=$(ls backend/models/*.js 2>/dev/null | wc -l)
    if [ $model_count -gt 0 ]; then
        pass "Database models configured ($model_count model files)"
    else
        fail "No model files found"
    fi
else
    fail "backend/models directory not found"
fi

# Summary
echo ""
echo "========================================="
echo "✅ Production Readiness Report"
echo "========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ NOT READY FOR PRODUCTION${NC}"
    echo "Please fix the failures above before deploying."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  READY WITH WARNINGS${NC}"
    echo "Address the warnings for a better production setup."
    exit 0
else
    echo -e "${GREEN}✅ READY FOR PRODUCTION${NC}"
    echo "All checks passed! You're ready to deploy."
    exit 0
fi
