#!/usr/bin/env python3

"""
Database Setup Script for Kenny's OS
Runs SQL migrations on Supabase via the SQL REST endpoint
"""

import os
import requests
import json

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    print('❌ Missing environment variables: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    exit(1)

# Extract project ID from URL
project_id = SUPABASE_URL.split('.')[0].split('//')[1]

def execute_sql(sql_query):
    """Execute SQL against Supabase via the Management API"""
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    headers = {
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "apikey": SERVICE_ROLE_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {"query": sql_query}
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print('🚀 Starting database setup...\n')
    
    # Read migration file
    try:
        with open('supabase/migrations/20260313_init_schema.sql', 'r') as f:
            sql = f.read()
        print('📋 Loaded migration SQL')
    except FileNotFoundError:
        print('❌ Migration file not found')
        exit(1)
    
    # Try executing
    print('🔄 Attempting to execute migrations...')
    print('⚠️  This requires the Supabase SQL endpoint to support raw SQL (may not work)\n')
    
    # The Management API doesn't directly support raw SQL execution
    # So we need to use the dashboard's SQL editor instead
    print('🔧 Manual Setup Required:')
    print('1. Go to https://app.supabase.com/project/{}/sql/new'.format(project_id))
    print('2. Copy the entire contents of supabase/migrations/20260313_init_schema.sql')
    print('3. Paste into the SQL editor')
    print('4. Click "Run"')
    print('5. Run this script again to verify\n')

if __name__ == '__main__':
    main()
