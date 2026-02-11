#!/bin/bash
# =============================================================================
# Integration test runner for ACE microservice
# Assumes the ACE container is running on localhost:7800 (HTTP) and :7600 (admin)
# =============================================================================

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:7800}"
ADMIN_URL="${ADMIN_URL:-http://localhost:7600}"

echo "=== ACE Microservice Integration Tests ==="
echo "Base URL:  $BASE_URL"
echo "Admin URL: $ADMIN_URL"
echo ""

# Test 1: Admin API health check
echo "[TEST 1] Admin API health check..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$ADMIN_URL/apiv2/servers/defaultServer")
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "  PASS - Admin API returned 200"
else
  echo "  FAIL - Admin API returned $HTTP_CODE"
  exit 1
fi

# Test 2: Verify deployed applications
echo "[TEST 2] Check deployed applications..."
APPS=$(curl -s "$ADMIN_URL/apiv2/servers/defaultServer/applications")
echo "  Deployed applications: $APPS"

# Test 3: HTTP listener is responding
echo "[TEST 3] HTTP listener responding..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" != "000" ]; then
  echo "  PASS - HTTP listener responded with $HTTP_CODE"
else
  echo "  WARN - HTTP listener not responding (may be expected if no flows deployed)"
fi

# Add service-specific tests below:
# Example:
# echo "[TEST 4] POST /api/orders..."
# RESPONSE=$(curl -s -X POST "$BASE_URL/api/orders" \
#   -H "Content-Type: application/json" \
#   -d '{"orderId": "TEST-001", "item": "widget"}')
# echo "  Response: $RESPONSE"

echo ""
echo "=== All tests completed ==="
