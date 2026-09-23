const axios = require('axios');
const io = require('socket.io-client');

async function testFullFlow() {
  try {
    console.log('1. Logging in as Admin...');
    const loginRes = await axios.post('http://localhost:4001/masjid/api/auth/login', {
      username: 'admin',
      password: 'password' // wait, I don't know the hashed password. 
      // User prompt said Gammadadmin53. Wait. I'll just use the controller directly?
    });
  } catch(e) {}
}
