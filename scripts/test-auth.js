const axios = require('axios');

const API_BASE_URL = 'https://web-production-d7d37.up.railway.app';

async function testRegistration() {
  try {
    console.log('Testing registration...');
    const username = `testuser_${Date.now()}`;
    const password = 'testpassword123';
    
    const response = await axios.post(
      `${API_BASE_URL}/register`,
      {
        username,
        password,
        phone_number: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        role: 1 // 1 for regular user, 2 for admin, etc.
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Registration successful:', {
      status: response.status,
      data: response.data
    });
    
    return { username, password };
  } catch (error) {
    console.error('\n=== ERROR DETAILS ===');
    
    // Log basic error info
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Log response details if available
    if (error.response) {
      console.error('\n=== RESPONSE ===');
      console.error('Status:', error.response.status, error.response.statusText);
      
      // Log raw response data
      console.error('Raw response data type:', typeof error.response.data);
      console.error('Raw response data:', error.response.data);
      
      // Try to parse and log response data
      try {
        // If data is already an object, use it directly
        if (error.response.data && typeof error.response.data === 'object') {
          console.error('Response data (object):', JSON.stringify(error.response.data, null, 2));
          
          // If there are validation errors, log them in a more readable format
          if (error.response.data.detail) {
            if (Array.isArray(error.response.data.detail)) {
              console.error('\nValidation errors:');
              error.response.data.detail.forEach((err, index) => {
                console.error(`${index + 1}. ${err.loc ? err.loc.join('.') + ' - ' : ''}${err.msg || JSON.stringify(err)} (${err.type || 'error'})`);
              });
            } else {
              console.error('Error detail:', error.response.data.detail);
            }
          }
        } else if (typeof error.response.data === 'string') {
          // If data is a string, try to parse it as JSON
          try {
            const parsedData = JSON.parse(error.response.data);
            console.error('Response data (parsed from string):', JSON.stringify(parsedData, null, 2));
          } catch (parseError) {
            console.error('Response data (string):', error.response.data);
          }
        }
      } catch (e) {
        console.error('Error processing response data:', e);
      }
      
      console.error('Response headers:', JSON.stringify(error.response.headers, null, 2));
    } else {
      console.error('\nNo response object in error');
    }
    
    // Log request details
    if (error.config) {
      console.error('\n=== REQUEST ===');
      console.error('URL:', error.config.url);
      console.error('Method:', error.config.method);
      console.error('Headers:', JSON.stringify(error.config.headers, null, 2));
      
      // Log request data if it exists
      if (error.config.data) {
        console.error('Request data type:', typeof error.config.data);
        try {
          const requestData = typeof error.config.data === 'string' 
            ? JSON.parse(error.config.data) 
            : error.config.data;
          console.error('Request data (parsed):', JSON.stringify(requestData, null, 2));
        } catch (e) {
          console.error('Could not parse request data as JSON, raw data:', error.config.data);
        }
      } else {
        console.error('No request data');
      }
    } else {
      console.error('\nNo config object in error');
    }
    
    // Log the full error object as a last resort
    console.error('\n=== FULL ERROR OBJECT ===');
    try {
      // Create a clean object with only serializable properties
      const cleanError = {};
      Object.getOwnPropertyNames(error).forEach(key => {
        try {
          cleanError[key] = error[key];
        } catch (e) {
          cleanError[key] = `[Error getting property '${key}']`;
        }
      });
      console.error(JSON.stringify(errorObj, null, 2));
    } catch (e) {
      console.error('Could not stringify error object:', e);
    }
    
    throw error;
  }
}

// Run the registration test
(async () => {
  try {
    console.log('Starting registration test...');
    await testRegistration();
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
})();
