async function run() {
  try {
    const res = await fetch('http://localhost:8000/api/v1/colleges/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await res.json();
    console.log(res.status, data);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
