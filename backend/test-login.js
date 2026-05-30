fetch('http://127.0.0.1:8001/api/v1/colleges/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'ramsahaysharma199@gmail.com',
    password: 'princesharma@123'
  })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
