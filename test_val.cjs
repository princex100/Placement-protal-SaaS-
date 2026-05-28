const axios = require('axios');

async function run() {
  try {
    const res = await axios.post('http://localhost:8000/api/v1/colleges/register', {
      collegeId: 'js',
      name: 'Test',
      email: 'test@test.com',
      password: 'password',
      phoneNumber: '123456789' // 9 digits
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", JSON.stringify(err.response?.data || err.message, null, 2));
  }
}

run();
