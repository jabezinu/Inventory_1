const http = require('http');

// Test creating a category
const data = JSON.stringify({
  name: 'Electronics',
  description: 'Electronic items'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/categories',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', responseData);
    
    // Now test getting all categories
    http.get('http://localhost:5000/api/categories', (res2) => {
      let data2 = '';
      res2.on('data', (chunk) => { data2 += chunk; });
      res2.on('end', () => {
        console.log('\nAll Categories:', data2);
      });
    });
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
