async function run() {
  try {
    const res = await fetch('http://localhost:8000/api/v1/colleges/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collegeId: 'js',
        name: 'Test3',
        email: 'test3@test.com',
        password: 'password',
        phoneNumber: '123456789' // 9 digits
      })
    });
    const data = await res.json();
    console.log(res.status, data);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
