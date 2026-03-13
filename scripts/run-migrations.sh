#!/bin/bash

# For Supabase, we need to use the dashboard's SQL editor
# But we can simulate this by breaking down the SQL and testing via API

SUPABASE_URL="https://jtngcypnstmsdyurjtkn.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bmdjeXBuc3Rtc2R5dXJqdGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjM2MjIsImV4cCI6MjA4ODg5OTYyMn0.RpJqFtw7R1fuvRQXq1t1mY0l1ns6ocOr4UFQkKui9i0"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bmdjeXBuc3Rtc2R5dXJqdGtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMyMzYyMiwiZXhwIjoyMDg4ODk5NjIyfQ.jfmzfvIR--FVQPEAJ57ztTgMnJA685IcYjCTgMENvAY"

# Test connectivity
echo "Testing Supabase connectivity..."
curl -s -H "apikey: $ANON_KEY" "$SUPABASE_URL/rest/v1/" | jq . || echo "Failed to connect"
