const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function testAPI() {
  try {
    console.log('Testing NestJS Backend API...\n');

    // Test 1: Create a job
    console.log('1. Creating a new job...');
    const createResponse = await axios.post(`${API_URL}/jobs`, {
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'Bangalore',
      jobType: 'Full-time',
      salary: '₹120,000 - ₹150,000',
      description: 'We are looking for an experienced frontend developer with strong React skills.',
      requirements: '5+ years of React experience, TypeScript, Redux',
      responsibilities: 'Build and maintain web applications, mentor junior developers',
      deadline: '2024-12-31'
    });
    console.log('✓ Job created successfully!');
    console.log('Job ID:', createResponse.data.id);
    console.log('Job Data:', JSON.stringify(createResponse.data, null, 2));
    
    const jobId = createResponse.data.id;

    // Test 2: Get all jobs
    console.log('\n2. Fetching all jobs...');
    const getAllResponse = await axios.get(`${API_URL}/jobs`);
    console.log(`✓ Found ${getAllResponse.data.length} job(s)`);

    // Test 3: Get single job
    console.log('\n3. Fetching single job...');
    const getOneResponse = await axios.get(`${API_URL}/jobs/${jobId}`);
    console.log('✓ Job retrieved:', getOneResponse.data.title);

    // Test 4: Update job
    console.log('\n4. Updating job...');
    const updateResponse = await axios.patch(`${API_URL}/jobs/${jobId}`, {
      salary: '₹130,000 - ₹160,000'
    });
    console.log('✓ Job updated successfully!');
    console.log('New salary:', updateResponse.data.salary);

    // Test 5: Filter jobs
    console.log('\n5. Testing filters...');
    const filterResponse = await axios.get(`${API_URL}/jobs?jobType=Full-time&location=Bangalore`);
    console.log(`✓ Found ${filterResponse.data.length} Full-time job(s) in Bangalore`);

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testAPI();
