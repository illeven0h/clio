import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const folder = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER;

    // Ensure correct folder structure
    const response = await cloudinary.v2.search
      .expression(`resource_type:video AND folder:${folder}`)
      .max_results(20)
      .execute();

    console.log("Cloudinary API Response:", response); // Debugging log

    return NextResponse.json({ videos: response.resources || [] });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos from Cloudinary" },
      { status: 500 }
    );
  }
}
