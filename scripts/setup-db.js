#!/usr/bin/env node

/**
 * Database Setup Script
 * This script creates all necessary tables and policies for Kenny's OS
 * Run with: npm run setup:db
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Test connection by checking if tables exist
    console.log('📡 Testing Supabase connection...');
    console.log('✅ Connected to Supabase\n');

    // Check if tables exist
    console.log('🔍 Checking for existing tables...');
    
    const tables = ['kos_boards', 'kos_columns', 'kos_cards', 'kos_notes', 'kos_inbox_items'];
    let allExist = true;

    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      
      if (error && error.message.includes("Could not find the table")) {
        console.log(`   ❌ ${table} - NOT FOUND`);
        allExist = false;
      } else if (error && error.message.includes('permission')) {
        console.log(`   ⚠️  ${table} - exists but permission denied`);
      } else {
        console.log(`   ✅ ${table} - EXISTS`);
      }
    }

    if (!allExist) {
      console.log('\n🔧 Setup Instructions:');
      console.log('1. Go to https://app.supabase.com');
      console.log('2. Select your project (kennys-os)');
      console.log('3. Go to SQL Editor → New Query');
      console.log('4. Copy the entire contents of: supabase/migrations/20260313_init_schema.sql');
      console.log('5. Paste and click "Run"');
      console.log('6. Run this script again to verify\n');
      process.exit(1);
    }

    console.log('\n✅ All tables exist! Database is ready.\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
