// import { NextResponse } from 'next/server';
// import cloudinary from 'cloudinary';

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// export async function GET() {
//   try {
//     const folder = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER || 'generatedVideos';
    
//     // Fetch videos from Cloudinary
//     const response = await cloudinary.v2.search
//       .expression(`resource_type:video AND folder:${folder}`)
//       .sort_by('created_at', 'desc')
//       .max_results(30)
//       .execute();
    
//     console.log("Cloudinary API Response:", response); // Debugging log

//     // Transform the results to a more usable format
//     const videos = response.resources.map(resource => {
//       return {
//         id: resource.public_id.split('/').pop(), // Extract just the filename
//         url: resource.secure_url,
//         thumbnail: resource.secure_url.replace('/video/upload/', '/video/upload/so_auto/').replace('.mp4', '.jpg'),
//         prompt: resource.tags?.filter(tag => tag !== 'ai-generated').join(' ') || 'AI Generated Video',
//         createdAt: resource.created_at
//       };
//     });

//     return NextResponse.json({ 
//       success: true, 
//       videos 
//     });
//   } catch (error) {
//     console.error('Error fetching videos from Cloudinary:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch videos', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Optional: Handle OPTIONS requests for CORS preflight
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     },
//   });
// }