#!/usr/bin/env node

/**
 * Apply kennys-os migration by directly calling Supabase SQL API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bmdjeXBuc3Rtc2R5dXJqdGtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMyMzYyMiwiZXhwIjoyMDg4ODk5NjIyfQ.jfmzfvIR--FVQPEAJ57ztTgMnJA685IcYjCTgMENvAY';

// Read SQL migration
const sqlPath = path.join(__dirname, '../supabase/migrations/20260313_init_schema.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log('🔧 Applying kennys-os database migration...\n');
console.log('⚠️  This requires manual execution via Supabase Dashboard\n');
console.log('Steps:');
console.log('1. Go to: https://supabase.com/dashboard/project/jtngcypnstmsdyurjtkn');
console.log('2. Navigate to SQL Editor');
console.log('3. Create a new query');
console.log('4. Paste the following SQL:\n');
console.log('=' .repeat(80));
console.log(sqlContent);
console.log('=' .repeat(80));
console.log('\n5. Click "RUN" to execute');
console.log('\n✅ After running, test with:');
console.log('   curl -H "apikey: <ANON_KEY>" \\');
console.log('     -H "Authorization: Bearer <ANON_KEY>" \\');
console.log('     "https://jtngcypnstmsdyurjtkn.supabase.co/rest/v1/kos_boards?select=*"');
console.log('\nIt should return the default "Main Board" entry.\n');
