#!/bin/bash
# I.AM Mail - Quick API Health Check
# Run with: ./tests/api-health.sh

set -e

BASE_URL="${1:-http://localhost:5001}"
USER_ID="sabiqahmed@gmail.com"

echo "========================================"
echo "   I.AM Mail - API Health Check"
echo "   Base URL: $BASE_URL"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ "$method" == "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -lt 400 ]; then
        echo -e "${GREEN}✓ OK ($http_code)${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL ($http_code)${NC}"
        echo "  Response: $body"
        return 1
    fi
}

echo "=== P0: Core APIs ==="
check_endpoint "Server Health" "GET" "/" || true
check_endpoint "Accounts API" "GET" "/api/accounts?userId=$USER_ID" || true
check_endpoint "Email Fetch (IMAP)" "GET" "/api/imap/emails?limit=3" || true
check_endpoint "SMTP Send (dry)" "POST" "/api/smtp/send" '{"to":"test@test.com","subject":"Test","body":"Test"}' || true

echo ""
echo "=== P1: Hub AI APIs ==="
check_endpoint "Hub Parse" "POST" "/api/hub/parse" '{"message":"hello","context":{}}' || true
check_endpoint "Hub Suggestions" "GET" "/api/hub/suggestions?screen=inbox" || true

echo ""
echo "=== P2: Auth APIs ==="
check_endpoint "Auth Login" "POST" "/api/auth/login" '{"email":"test@test.com","password":"test"}' || true

echo ""
echo "========================================"
echo "   Health Check Complete!"
echo "========================================"
