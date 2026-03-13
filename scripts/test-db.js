#!/usr/bin/env node

/**
 * Test kennys-os database connectivity and table access
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from repo root
config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('   Make sure .env has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🔍 Testing kennys-os database...\n');

const tables = [
  'kos_boards',
  'kos_columns', 
  'kos_cards',
  'kos_notes',
  'kos_inbox_items'
];

async function testTable(tableName) {
  return new Promise((resolve) => {
    const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=1`;
    
    const options = {
      method: 'GET',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`
      }
    };

    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const rows = JSON.parse(data);
            console.log(`✅ ${tableName.padEnd(20)} - OK (${rows.length} row${rows.length !== 1 ? 's' : ''})`);
            resolve({ table: tableName, status: 'ok', count: rows.length });
          } catch (e) {
            console.log(`⚠️  ${tableName.padEnd(20)} - Parse error`);
            resolve({ table: tableName, status: 'parse_error' });
          }
        } else if (res.statusCode === 404) {
          console.log(`❌ ${tableName.padEnd(20)} - NOT FOUND (table doesn't exist)`);
          resolve({ table: tableName, status: 'not_found' });
        } else if (res.statusCode === 401) {
          console.log(`❌ ${tableName.padEnd(20)} - UNAUTHORIZED (RLS policy issue?)`);
          resolve({ table: tableName, status: 'unauthorized' });
        } else {
          console.log(`❌ ${tableName.padEnd(20)} - HTTP ${res.statusCode}`);
          resolve({ table: tableName, status: `error_${res.statusCode}` });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${tableName.padEnd(20)} - Network error: ${err.message}`);
      resolve({ table: tableName, status: 'network_error' });
    });
  });
}

// Test all tables
const results = [];
for (const table of tables) {
  const result = await testTable(table);
  results.push(result);
}

console.log('\n' + '='.repeat(60));

const allOk = results.every(r => r.status === 'ok');
const someNotFound = results.some(r => r.status === 'not_found');
const someUnauthorized = results.some(r => r.status === 'unauthorized');

if (allOk) {
  console.log('✅ All tables accessible! Database is ready.');
} else if (someNotFound) {
  console.log('❌ Some tables are missing.');
  console.log('\n📝 Run the migration:');
  console.log('   npm run migration:show');
  console.log('\n   Then paste the SQL into Supabase Dashboard SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/jtngcypnstmsdyurjtkn/editor');
} else if (someUnauthorized) {
  console.log('❌ Permission denied (401).');
  console.log('\n🔧 Check:');
  console.log('   1. RLS policies are correctly set (allow anon SELECT)');
  console.log('   2. .env has correct VITE_SUPABASE_ANON_KEY');
  console.log('   3. Re-run migration if needed: npm run migration:show');
} else {
  console.log('❌ Database connection issues.');
  console.log('\n🔧 Check:');
  console.log('   1. VITE_SUPABASE_URL is correct');
  console.log('   2. VITE_SUPABASE_ANON_KEY is correct');
  console.log('   3. Internet connection');
}

console.log('='.repeat(60) + '\n');

process.exit(allOk ? 0 : 1);
