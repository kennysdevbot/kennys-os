#!/bin/bash

# Bootstrap Script for Supabase Database
# This script creates all necessary tables for Kenny's OS

set -a
source .env
set +a

PROJECT_ID="jtngcypnstmsdyurjtkn"
SUPABASE_URL="https://${PROJECT_ID}.supabase.co"

# Read the migration SQL
SQL_SCRIPT=$(cat supabase/migrations/20260313_init_schema.sql)

# The Management API endpoint for running SQL
API_URL="${SUPABASE_URL}/rest/v1/rpc/sql"

echo "🚀 Bootstrapping Supabase database..."
echo "Project: $PROJECT_ID"
echo ""

# Attempt to execute via rpc (if available)
# This is a workaround and may not work depending on RLS policies
curl -s -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$(echo "$SQL_SCRIPT" | jq -Rs .)\"}" \
  "${SUPABASE_URL}/rest/v1/" | jq . || true

echo ""
echo "⚠️  If the above failed, use the Supabase Dashboard:"
echo "1. Go to: https://app.supabase.com/project/${PROJECT_ID}/sql/new"
echo "2. Paste contents of: supabase/migrations/20260313_init_schema.sql"
echo "3. Click 'Run'"
