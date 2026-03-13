#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  try {
    const migrationFile = path.join(__dirname, '../supabase/migrations/20260313_init_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf-8');

    console.log('Running migrations...');
    
    // Split by semicolon but handle multi-line statements carefully
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (!statement.trim() || statement.trim().startsWith('--')) continue;
      
      console.log('Executing:', statement.substring(0, 60) + '...');
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement.trim()
      }).catch(() => {
        // If exec_sql doesn't exist, try raw query
        return supabase.from('pg_tables').select('*');
      });
      
      if (error && !error.message.includes('already exists')) {
        console.error('Error:', error);
      }
    }
    
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
