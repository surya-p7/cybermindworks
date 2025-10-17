const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function testFrontendCreate() {
  try {
    console.log('Testing job creation with frontend data structure...\n');

    // Simulate what the frontend sends (without status and applicants)
    const frontendData = {
      title: "Test Job",
      company: "Test Company",
      location: "Mumbai",
      jobType: "Full-time",
      salary: "₹50,000 - ₹70,000",
      description: "This is a test job description"
      // Note: missing requirements, responsibilities, deadline (they are optional)
    };

    console.log('Sending data:', JSON.stringify(frontendData, null, 2));

    const response = await axios.post(`${API_URL}/jobs`, frontendData);
    console.log('\n✓ Job created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('\n❌ Failed to create job:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testFrontendCreate();
