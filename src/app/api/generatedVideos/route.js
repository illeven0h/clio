import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Sending request to Segmind...');

    // Create request payload following the Python example
    const payload = {
      prompt: prompt,
      input_frames: 49,
      steps: 45, 
      guidance_scale: 6,
      seed: 806286757407563,
      frame_rate: 8
    };
    
    console.log('Request payload:', JSON.stringify(payload));

    if (!process.env.SEGMIND_API_KEY || !process.env.SEGMIND_API_URL) {
      console.error('Missing Segmind API key or URL in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Missing API credentials' },
        { status: 500 }
      );
    }

    // Set up headers like in the Python example
    const headers = {
      'x-api-key': process.env.SEGMIND_API_KEY,
      'Accept': 'video/mp4',
      'Content-Type': 'application/json'
    };

    // Make the API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    try {
      const response = await fetch(process.env.SEGMIND_API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 429) {
          console.log("Rate limit hit. Please wait before making more requests.");
          return NextResponse.json(
            { error: 'Rate limit hit. Please wait before making more requests.' },
            { status: 429 }
          );
        }
        
        const errorText = await response.text();
        console.error(`HTTP error: ${response.status} - ${errorText}`);
        
        return NextResponse.json(
          { error: `Error from Segmind API: ${response.status}`, details: errorText },
          { status: response.status }
        );
      }

      // Get video binary data
      const videoBuffer = await response.arrayBuffer();
      
      // Convert ArrayBuffer to Base64
      const videoBase64 = Buffer.from(videoBuffer).toString('base64');
      console.log('Video buffer size:', videoBuffer.byteLength);
      
      // Return the video as base64 data URL
      return NextResponse.json({ 
        success: true,
        videoData: videoBase64
      });
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout', details: 'The API request took too long to respond' },
          { status: 504 }
        );
      }
      throw fetchError; // rethrow to be caught by outer try/catch
    }
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate video', 
        details: error.message || 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Optional: Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}