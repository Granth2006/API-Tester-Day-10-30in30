export async function sendRequest(url, method, headers, body) {
  const startTime = performance.now();
  
  let responseData = {
    status: 0,
    time: 0,
    size: 0,
    headers: {},
    body: null,
    error: null,
    isJson: false
  };

  try {
    const options = {
      method,
      headers: { ...headers }
    };
    
    if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
      options.body = body;
    }

    const response = await fetch(url, options);
    
    const endTime = performance.now();
    responseData.time = Math.round(endTime - startTime);
    responseData.status = response.status;
    
    // Process Headers
    for (const [key, value] of response.headers.entries()) {
      responseData.headers[key] = value;
    }
    
    // Read Body as text first to calculate size
    const textData = await response.text();
    responseData.size = new Blob([textData]).size;
    
    responseData.body = textData;
    
    // Check if JSON
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        responseData.body = JSON.stringify(JSON.parse(textData), null, 2);
        responseData.isJson = true;
      } catch (e) {
        // Leave as text if parsing fails despite content-type
      }
    }

  } catch (error) {
    const endTime = performance.now();
    responseData.time = Math.round(endTime - startTime);
    responseData.error = error.message;
  }
  
  return responseData;
}
