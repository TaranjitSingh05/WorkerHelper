// Test script to verify workers_data table integration
// Run this in browser console or as a Node.js script

import { supabase } from './src/utils/supabase.js';

async function testWorkersDataIntegration() {
  console.log('🔍 Testing workers_data table integration...');
  
  try {
    // Test 1: Check if table exists by trying to select from it
    console.log('📋 Step 1: Testing table accessibility...');
    const { data, error } = await supabase
      .from('workers_data')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Table access failed:', error);
      if (error.code === '42P01') {
        console.log('💡 Solution: Run workers_data_setup.sql in Supabase SQL Editor');
      }
      return false;
    }
    
    console.log('✅ Table access successful');
    
    // Test 2: Try inserting a test record
    console.log('📝 Step 2: Testing data insertion...');
    
    const testData = {
      health_id: `WH-TEST-${Date.now()}`,
      full_name: 'Test Worker',
      date_of_birth: '1990-01-01',
      age: 34,
      gender: 'Male',
      phone_number: '1234567890',
      address: 'Test Address, Test City',
      occupation_type: 'Construction',
      contractor_name: 'Test Contractor',
      blood_group: 'O+',
      allergies: 'None',
      chronic_diseases: 'None',
      vaccination_status: 'Fully Vaccinated',
      qr_code_data: `WH-TEST-${Date.now()}`
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('workers_data')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('❌ Data insertion failed:', insertError);
      return false;
    }
    
    console.log('✅ Data insertion successful:', insertData[0]);
    
    // Test 3: Verify the inserted data
    console.log('🔍 Step 3: Verifying inserted data...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('workers_data')
      .select('*')
      .eq('health_id', testData.health_id);
    
    if (verifyError) {
      console.error('❌ Data verification failed:', verifyError);
      return false;
    }
    
    if (verifyData.length === 0) {
      console.error('❌ Inserted data not found');
      return false;
    }
    
    console.log('✅ Data verification successful');
    console.log('📊 Record details:', verifyData[0]);
    
    // Test 4: Clean up test data
    console.log('🧹 Step 4: Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('workers_data')
      .delete()
      .eq('health_id', testData.health_id);
    
    if (deleteError) {
      console.warn('⚠️ Test data cleanup failed (not critical):', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }
    
    console.log('🎉 All tests passed! Integration is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
    return false;
  }
}

// Export for use in other modules
export { testWorkersDataIntegration };

// If running directly in browser console:
// testWorkersDataIntegration();

console.log('ℹ️ To run the test, execute: testWorkersDataIntegration()');