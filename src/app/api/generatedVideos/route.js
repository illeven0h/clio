// app/api/generateVideos/route.js
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

    console.log('Sending request...');
    console.log('API URL:', process.env.SEGMIND_API_URL);
    console.log('API Key exists:', !!process.env.SEGMIND_API_KEY);

    // Check if environment variables are set
    if (!process.env.SEGMIND_API_KEY) {
      console.error('tokken not found in environment variables');
      return NextResponse.json(
        { error: 'Tokken configuration missing' },
        { status: 500 }
      );
    }

    if (!process.env.SEGMIND_API_URL) {
      console.error('tokken not found in environment variables');
      return NextResponse.json(
        { error: 'API URL configuration missing' },
        { status: 500 }
      );
    }

    // Create request payload with optimized settings for faster generation
    const payload = {
      prompt: prompt,
      input_frames: 25, // Reduced from 49 for faster generation
      steps: 30,        // Reduced from 45 for faster generation
      guidance_scale: 6,
      seed: 806286757407563,
      frame_rate: 8
    };
    
    console.log('Request payload:', JSON.stringify(payload));

    // Set up headers like in the Python example
    const headers = {
      'x-api-key': process.env.SEGMIND_API_KEY,
      'Accept': 'video/mp4',
      'Content-Type': 'application/json'
    };

    // Make the API request with extended timeout for video generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minute timeout

    let response;
    try {
      response = await fetch(process.env.SEGMIND_API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - video generation took too long (over 10 minutes). Please try again with a simpler prompt.' },
          { status: 408 }
        );
      }
      
      // Check for specific network errors
      if (fetchError.code === 'ECONNRESET' || fetchError.code === 'ENOTFOUND') {
        return NextResponse.json(
          { error: 'Network connection error - please check your internet connection and API configuration', details: fetchError.message },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: 'Network error - unable to connect to video generation service', details: fetchError.message },
        { status: 503 }
      );
    }

    clearTimeout(timeoutId);
    console.log(`Response status: ${response.status}`);
    console.log('Response content-type:', response.headers.get('content-type'));

    if (!response.ok) {
      if (response.status === 429) {
        console.log("Rate limit hit. Please wait before making more requests.");
        return NextResponse.json(
          { error: 'Rate limit hit. Please wait before making more requests.' },
          { status: 429 }
        );
      }
      
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Unable to read error response';
      }
      
      console.error(`HTTP error: ${response.status} - ${errorText}`);
      
      return NextResponse.json(
        { error: `Error from Segmind API: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    // Get video binary data
    let videoBuffer;
    try {
      videoBuffer = await response.arrayBuffer();
    } catch (bufferError) {
      console.error('Error reading video buffer:', bufferError);
      return NextResponse.json(
        { error: 'Error processing video data', details: bufferError.message },
        { status: 500 }
      );
    }
    
    console.log('Video buffer size:', videoBuffer.byteLength);
    
    if (videoBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Received empty video data' },
        { status: 500 }
      );
    }
    
    // Convert ArrayBuffer to Base64
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    
    console.log('Video generated successfully, size:', videoBase64.length);
    
    // Return the video as base64 data URL
    return NextResponse.json({ 
      success: true,
      videoData: videoBase64
    });
    
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate video', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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