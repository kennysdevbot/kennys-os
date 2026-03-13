#!/usr/bin/env node

/**
 * Bootstrap Server for Kenny's OS
 * Temporarily runs migrations on Supabase
 * Usage: npm run server:bootstrap
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize database
async function initializeDatabase() {
  try {
    const migrationPath = join(__dirname, 'supabase/migrations/20260313_init_schema.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📋 Running migrations...');

    // We can't execute raw SQL directly via JS client
    // But we can check if tables exist and provide instructions
    
    const { error: boardsError } = await supabase
      .from('kos_boards')
      .select('*')
      .limit(1);

    if (boardsError?.message?.includes('Could not find the table')) {
      console.log('\n❌ Tables not found in Supabase');
      console.log('\n🔧 Manual setup required:');
      console.log(`1. Go to: https://app.supabase.com/project/jtngcypnstmsdyurjtkn/sql/new`);
      console.log('2. Copy the SQL from supabase/migrations/20260313_init_schema.sql');
      console.log('3. Paste and execute');
      console.log('4. Then reload this page\n');
      return false;
    }

    console.log('✅ Database initialized');
    return true;
  } catch (error) {
    console.error('Setup error:', error);
    return false;
  }
}

app.get('/', async (req, res) => {
  const initialized = await initializeDatabase();
  
  if (initialized) {
    res.send(`
      <html>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>✅ Kenny's OS - Database Initialized</h1>
          <p><a href="http://localhost:5173">👉 Go to the app</a></p>
        </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
        <body style="font-family: monospace; padding: 20px; background: #f5f5f5;">
          <h1>🔧 Kenny's OS - Database Setup Required</h1>
          <p><strong>Tables not found in Supabase.</strong></p>
          <p style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong>Setup instructions:</strong><br/><br/>
            1. <a href="https://app.supabase.com/project/jtngcypnstmsdyurjtkn/sql/new" target="_blank">
              Open Supabase SQL Editor
            </a><br/><br/>
            2. Copy and paste the entire contents of:<br/>
            <code>supabase/migrations/20260313_init_schema.sql</code><br/><br/>
            3. Click "Run"<br/><br/>
            4. Come back here and reload this page
          </p>
          <p style="margin-top: 30px; color: #666;">
            <small>After setup is complete, go to <a href="http://localhost:5173">localhost:5173</a></small>
          </p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Bootstrap server running on http://localhost:${PORT}`);
  console.log('Open this URL to see setup status and instructions\n');
});
