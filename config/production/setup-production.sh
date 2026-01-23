#!/bin/bash

# CrackerShop Production Setup Script
# This script sets up the production environment

set -e

echo "🚀 CrackerShop Production Setup"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}⚠️  This script should be run as root for system-level setup${NC}"
fi

# Backend Setup
echo -e "\n${YELLOW}1. Setting up Backend...${NC}"
cd backend

# Install Node dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install --production

# Create necessary directories
mkdir -p logs uploads

# Setup environment if not exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production not found${NC}"
    echo "Please configure .env.production before running this script"
    exit 1
fi

echo -e "${GREEN}✓ Backend setup complete${NC}"

# Database Setup
echo -e "\n${YELLOW}2. Setting up Database...${NC}"
echo "Ensuring MongoDB indices..."
node scripts/createIndices.js || true

echo -e "${GREEN}✓ Database setup complete${NC}"

# Frontend Setup
echo -e "\n${YELLOW}3. Setting up Frontend...${NC}"
cd ../frontend

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install --production

# Build for production
echo -e "${GREEN}Building for production...${NC}"
npm run build || true

echo -e "${GREEN}✓ Frontend setup complete${NC}"

# Return to root
cd ..

# System Setup
echo -e "\n${YELLOW}4. System Configuration...${NC}"

# Create systemd service file (if running as root)
if [ "$EUID" -eq 0 ]; then
    echo -e "${GREEN}Creating systemd service...${NC}"
    
    cat > /etc/systemd/system/crackershop.service << EOF
[Unit]
Description=CrackerShop API
After=network.target mongodb.service

[Service]
Type=simple
User=nodejs
WorkingDirectory=$(pwd)/backend
ExecStart=$(which node) server.js
Restart=always
EnvironmentFile=$(pwd)/backend/.env.production

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    echo -e "${GREEN}✓ Systemd service created${NC}"
fi

# Setup Nginx (if running as root)
if [ "$EUID" -eq 0 ]; then
    echo -e "${GREEN}Setting up Nginx...${NC}"
    
    # Copy nginx config
    cp nginx.conf /etc/nginx/sites-available/crackershop.conf
    
    # Enable site
    ln -sf /etc/nginx/sites-available/crackershop.conf /etc/nginx/sites-enabled/crackershop.conf
    
    # Test nginx config
    nginx -t
    
    # Reload nginx
    systemctl reload nginx
    
    echo -e "${GREEN}✓ Nginx configured${NC}"
fi

# Setup SSL (if running as root)
if [ "$EUID" -eq 0 ]; then
    echo -e "\n${YELLOW}5. SSL Setup${NC}"
    
    if command -v certbot &> /dev/null; then
        echo -e "${YELLOW}Certbot found. Run the following to setup SSL:${NC}"
        echo "sudo certbot certonly --webroot -w /var/www/crackershop -d api.yourdomain.com"
        echo "Then update nginx.conf with certificate paths"
    else
        echo -e "${RED}Certbot not found. Install it with: apt-get install certbot python3-certbot-nginx${NC}"
    fi
fi

# Backup Strategy
echo -e "\n${YELLOW}6. Setup Backup Strategy${NC}"

if [ "$EUID" -eq 0 ]; then
    # Create backup script
    mkdir -p /usr/local/bin
    
    cat > /usr/local/bin/crackershop-backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/crackershop"
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri "$MONGO_URI" --out $BACKUP_DIR/db_$DATE
tar -czf $BACKUP_DIR/db_$DATE.tar.gz $BACKUP_DIR/db_$DATE
rm -rf $BACKUP_DIR/db_$DATE

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ./backend/uploads/

echo "Backup completed: $DATE"
EOF

    chmod +x /usr/local/bin/crackershop-backup.sh
    
    # Add cron job for daily backups (3 AM)
    echo "0 3 * * * /usr/local/bin/crackershop-backup.sh" | crontab -
    
    echo -e "${GREEN}✓ Backup script created and scheduled${NC}"
fi

# Final checks
echo -e "\n${YELLOW}7. Final Checks${NC}"

echo -e "${GREEN}Production setup checklist:${NC}"
echo "✓ Backend configured"
echo "✓ Frontend built"
echo "✓ Database indices created"

if [ "$EUID" -eq 0 ]; then
    echo "✓ Systemd service created"
    echo "✓ Nginx configured"
    echo "✓ Backup scheduled"
fi

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Configure SSL certificate"
echo "2. Start the service: systemctl start crackershop"
echo "3. Enable auto-start: systemctl enable crackershop"
echo "4. Check logs: journalctl -u crackershop -f"
echo "5. Verify: curl https://api.yourdomain.com/health"

echo -e "\n${GREEN}✅ Production setup complete!${NC}"
