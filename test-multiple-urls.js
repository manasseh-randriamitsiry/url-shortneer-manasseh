const fetch = require('node-fetch');

async function testMultipleUrls() {
  const baseUrl = 'http://localhost:3000';
  const testUrls = [
    'https://www.google.com',
    'https://github.com/microsoft/typescript',
    'https://nestjs.com/techniques/database',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://stackoverflow.com/questions/tagged/nestjs'
  ];
  
  console.log('Testing URL Shortener with Multiple URLs...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    const originalUrl = testUrls[i];
    console.log(`Test ${i + 1}: Creating short URL for ${originalUrl}`);
    
    try {
      // Create short URL
      const createResponse = await fetch(`${baseUrl}/api/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl })
      });
      
      if (!createResponse.ok) {
        throw new Error(`HTTP ${createResponse.status}: ${createResponse.statusText}`);
      }
      
      const shortUrl = await createResponse.json();
      console.log(`Short Code: ${shortUrl.shortCode}`);
      
      // Test redirection
      const redirectResponse = await fetch(`${baseUrl}/${shortUrl.shortCode}`, {
        method: 'GET',
        redirect: 'manual'
      });
      
      if (redirectResponse.status === 302) {
        const redirectLocation = redirectResponse.headers.get('location');
        const isExactMatch = redirectLocation === originalUrl;
        const isValidRedirect = redirectLocation.startsWith(originalUrl) || originalUrl.startsWith(redirectLocation);
        
        console.log(`Redirects to: ${redirectLocation}`);
        console.log(`Match: ${isExactMatch ? 'EXACT' : isValidRedirect ? 'VALID' : 'NO'}`);
      } else {
        console.log(`Expected 302, got ${redirectResponse.status}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`Error: ${error.message}\n`);
    }
  }
  
  console.log('Multiple URL testing completed!');
}

testMultipleUrls();
