const axios = require('axios');

const API_URL = 'http://localhost:3001';
let authToken = '';
let userId = '';
let jobId = '';
let applicationId = '';

// Test user credentials
const testUser = {
  email: `testuser${Date.now()}@example.com`,
  password: 'password123',
  fullName: 'Test User',
  role: 'employer',
  phone: '+1234567890',
  location: 'New York, USA'
};

const testJobSeeker = {
  email: `jobseeker${Date.now()}@example.com`,
  password: 'password123',
  fullName: 'Job Seeker',
  role: 'jobseeker',
  phone: '+9876543210',
  location: 'San Francisco, USA'
};

let jobSeekerToken = '';

async function testRegister() {
  console.log('\n🧪 Test 1: User Registration (Employer)');
  try {
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    authToken = response.data.access_token;
    userId = response.data.user.id;
    console.log('✅ Registration successful');
    console.log('   User ID:', userId);
    console.log('   Token received:', authToken.substring(0, 20) + '...');
    return true;
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🧪 Test 2: User Login');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.access_token;
    console.log('✅ Login successful');
    console.log('   Token received:', authToken.substring(0, 20) + '...');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetProfile() {
  console.log('\n🧪 Test 3: Get User Profile');
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('   User:', response.data.fullName);
    console.log('   Role:', response.data.role);
    return true;
  } catch (error) {
    console.error('❌ Get profile failed:', error.response?.data || error.message);
    return false;
  }
}

async function testCreateJobWithoutAuth() {
  console.log('\n🧪 Test 4: Create Job Without Authentication (Should Fail)');
  try {
    await axios.post(`${API_URL}/jobs`, {
      title: 'Test Job',
      company: 'Test Company',
      location: 'Test Location',
      description: 'Test Description'
    });
    console.error('❌ Job creation should have failed without auth');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly rejected unauthorized request');
      return true;
    }
    console.error('❌ Unexpected error:', error.response?.data || error.message);
    return false;
  }
}

async function testCreateJobWithAuth() {
  console.log('\n🧪 Test 5: Create Job With Authentication');
  try {
    const response = await axios.post(`${API_URL}/jobs`, {
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'New York, USA',
      description: 'We are looking for an experienced frontend developer',
      jobType: 'Full-time',
      salary: '$120,000 - $150,000',
      requirements: '5+ years of React experience',
      responsibilities: 'Build and maintain web applications',
      deadline: '2024-12-31'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    jobId = response.data.id;
    console.log('✅ Job created successfully');
    console.log('   Job ID:', jobId);
    console.log('   Posted by:', response.data.postedById);
    return true;
  } catch (error) {
    console.error('❌ Job creation failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetAllJobs() {
  console.log('\n🧪 Test 6: Get All Jobs (Public)');
  try {
    const response = await axios.get(`${API_URL}/jobs`);
    console.log('✅ Jobs retrieved successfully');
    console.log('   Total jobs:', response.data.length);
    return true;
  } catch (error) {
    console.error('❌ Get jobs failed:', error.response?.data || error.message);
    return false;
  }
}

async function testRegisterJobSeeker() {
  console.log('\n🧪 Test 7: Register Job Seeker');
  try {
    const response = await axios.post(`${API_URL}/auth/register`, testJobSeeker);
    jobSeekerToken = response.data.access_token;
    console.log('✅ Job seeker registered successfully');
    console.log('   Token received:', jobSeekerToken.substring(0, 20) + '...');
    return true;
  } catch (error) {
    console.error('❌ Job seeker registration failed:', error.response?.data || error.message);
    return false;
  }
}

async function testApplyToJob() {
  console.log('\n🧪 Test 8: Apply to Job');
  try {
    const response = await axios.post(`${API_URL}/applications`, {
      jobId: jobId,
      coverLetter: 'I am very interested in this position and believe I would be a great fit.',
      resume: 'https://example.com/resume.pdf'
    }, {
      headers: { Authorization: `Bearer ${jobSeekerToken}` }
    });
    applicationId = response.data.id;
    console.log('✅ Application submitted successfully');
    console.log('   Application ID:', applicationId);
    console.log('   Status:', response.data.status);
    return true;
  } catch (error) {
    console.error('❌ Application failed:', error.response?.data || error.message);
    return false;
  }
}

async function testApplyToJobTwice() {
  console.log('\n🧪 Test 9: Apply to Same Job Twice (Should Fail)');
  try {
    await axios.post(`${API_URL}/applications`, {
      jobId: jobId,
      coverLetter: 'Applying again'
    }, {
      headers: { Authorization: `Bearer ${jobSeekerToken}` }
    });
    console.error('❌ Should not allow duplicate application');
    return false;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('✅ Correctly prevented duplicate application');
      return true;
    }
    console.error('❌ Unexpected error:', error.response?.data || error.message);
    return false;
  }
}

async function testGetMyApplications() {
  console.log('\n🧪 Test 10: Get My Applications (Job Seeker)');
  try {
    const response = await axios.get(`${API_URL}/applications/my-applications`, {
      headers: { Authorization: `Bearer ${jobSeekerToken}` }
    });
    console.log('✅ Applications retrieved successfully');
    console.log('   Total applications:', response.data.length);
    if (response.data.length > 0) {
      console.log('   First application job:', response.data[0].job.title);
    }
    return true;
  } catch (error) {
    console.error('❌ Get applications failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetJobApplications() {
  console.log('\n🧪 Test 11: Get Job Applications (Employer)');
  try {
    const response = await axios.get(`${API_URL}/applications/job/${jobId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Job applications retrieved successfully');
    console.log('   Total applicants:', response.data.length);
    if (response.data.length > 0) {
      console.log('   First applicant:', response.data[0].applicant.fullName);
      console.log('   Application status:', response.data[0].status);
    }
    return true;
  } catch (error) {
    console.error('❌ Get job applications failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUpdateApplicationStatus() {
  console.log('\n🧪 Test 12: Update Application Status (Employer)');
  try {
    const response = await axios.patch(`${API_URL}/applications/${applicationId}/status`, {
      status: 'reviewed'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Application status updated successfully');
    console.log('   New status:', response.data.status);
    return true;
  } catch (error) {
    console.error('❌ Update status failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetUserProfile() {
  console.log('\n🧪 Test 13: Get User Profile with Applications');
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${jobSeekerToken}` }
    });
    console.log('✅ User profile retrieved successfully');
    console.log('   User:', response.data.fullName);
    console.log('   Applications count:', response.data.applications?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Get user profile failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetMyJobs() {
  console.log('\n🧪 Test 14: Get My Posted Jobs (Employer)');
  try {
    const response = await axios.get(`${API_URL}/jobs/my-jobs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Posted jobs retrieved successfully');
    console.log('   Total posted jobs:', response.data.length);
    return true;
  } catch (error) {
    console.error('❌ Get my jobs failed:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Authentication & Job Application Flow Tests\n');
  console.log('=' .repeat(60));
  
  const tests = [
    testRegister,
    testLogin,
    testGetProfile,
    testCreateJobWithoutAuth,
    testCreateJobWithAuth,
    testGetAllJobs,
    testRegisterJobSeeker,
    testApplyToJob,
    testApplyToJobTwice,
    testGetMyApplications,
    testGetJobApplications,
    testUpdateApplicationStatus,
    testGetUserProfile,
    testGetMyJobs
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Fatal error running tests:', error.message);
  process.exit(1);
});
