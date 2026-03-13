#!/usr/bin/env node

/**
 * Apply kennys-os database migration to Supabase
 * Uses service role key for elevated permissions
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://jtngcypnstmsdyurjtkn.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bmdjeXBuc3Rtc2R5dXJqdGtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMyMzYyMiwiZXhwIjoyMDg4ODk5NjIyfQ.jfmzfvIR--FVQPEAJ57ztTgMnJA685IcYjCTgMENvAY';

// Read migration SQL
const sqlPath = path.join(__dirname, '../supabase/migrations/20260313_init_schema.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

// Split SQL into individual statements (basic approach)
const statements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements to execute`);

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/query`);
    
    const postData = JSON.stringify({ query: sql });
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data });
        } else {
          reject({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

console.log('\n⚠️  MANUAL MIGRATION REQUIRED ⚠️');
console.log('\nThe migration needs to be run manually via Supabase Dashboard:');
console.log('\n1. Go to: https://supabase.com/dashboard/project/jtngcypnstmsdyurjtkn/editor');
console.log('2. Open SQL Editor');
console.log('3. Paste and run the contents of:');
console.log(`   ${sqlPath}`);
console.log('\nAlternatively, use npx supabase link and supabase db push if you have Supabase CLI.\n');

// For now, output the migration as a single block
console.log('=== SQL TO RUN ===');
console.log(sqlContent);
console.log('=== END SQL ===\n');
