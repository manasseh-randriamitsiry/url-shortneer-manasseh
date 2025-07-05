const fetch = require('node-fetch');

async function testAPI() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('Testing URL Shortener API...\n');
    
    // Test 1: Create a short URL
    console.log('Test 1: Creating a short URL...');
    const createResponse = await fetch(`${baseUrl}/api/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalUrl: 'https://www.google.com'
      })
    });
    
    if (!createResponse.ok) {
      throw new Error(`HTTP ${createResponse.status}: ${createResponse.statusText}`);
    }
    
    const shortUrl = await createResponse.json();
    console.log('Short URL created successfully:');
    console.log(`Original URL: ${shortUrl.originalUrl}`);
    console.log(`Short Code: ${shortUrl.shortCode}`);
    console.log(`Full Short URL: ${baseUrl}/${shortUrl.shortCode}`);
    console.log(`Created At: ${shortUrl.createdAt}\n`);
    
    // Test 2: Test redirection
    console.log('Test 2: Testing redirection...');
    const redirectResponse = await fetch(`${baseUrl}/${shortUrl.shortCode}`, {
      method: 'GET',
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    if (redirectResponse.status === 302) {
      const redirectLocation = redirectResponse.headers.get('location');
      console.log('Redirection working correctly:');
      console.log(`Status: ${redirectResponse.status} (Found)`);
      console.log(`Redirects to: ${redirectLocation}`);
      console.log(`Expected: ${shortUrl.originalUrl}`);
      // Check for exact match or if redirect URL starts with original URL (handles trailing slash)
      const isExactMatch = redirectLocation === shortUrl.originalUrl;
      const isValidRedirect = redirectLocation.startsWith(shortUrl.originalUrl) || shortUrl.originalUrl.startsWith(redirectLocation);
      console.log(`Match: ${isExactMatch ? 'EXACT' : isValidRedirect ? 'VALID (with trailing slash)' : 'NO'}\n`);
    } else {
      console.log(`Expected 302 redirect, got ${redirectResponse.status}\n`);
    }
    
    // Test 3: Test invalid short code
    console.log('Test 3: Testing invalid short code...');
    const invalidResponse = await fetch(`${baseUrl}/invalidcode123`, {
      method: 'GET',
      redirect: 'manual'
    });
    
    console.log(`   Status: ${invalidResponse.status}`);
    if (invalidResponse.status === 404) {
      console.log('Invalid short code correctly returns 404\n');
    } else {
      console.log('Expected 404 for invalid short code\n');
    }
    
    console.log('All tests completed!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('\nMake sure the server is running with: npm run start:dev');
  }
}

testAPI();
