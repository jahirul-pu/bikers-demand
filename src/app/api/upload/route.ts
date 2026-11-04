import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function verifyImageSignature(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 12) return false;

  // JPEG signature: FF D8 FF
  if (mime === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (mime === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // WebP signature: RIFF....WEBP
  if (mime === "image/webp") {
    const isRiff = buffer.toString("ascii", 0, 4) === "RIFF";
    const isWebp = buffer.toString("ascii", 8, 12) === "WEBP";
    return isRiff && isWebp;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 5MB limit. Please upload a smaller image." },
        { status: 400 }
      );
    }

    const mime = (file.type || "").toLowerCase();
    const safeExt = ALLOWED_MIME_TYPES[mime];

    if (!safeExt) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed (SVG and scripts are strictly rejected).",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!verifyImageSignature(buffer, mime)) {
      return NextResponse.json(
        { success: false, error: "File contents do not match a valid image format." },
        { status: 400 }
      );
    }

    // Generate random collision-free filename with guaranteed safe extension
    const randomName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${safeExt}`;
    const filename = `product-${randomName}`;

    // 1. Try Supabase Storage if configured
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jdnzsiaxtcukwobvfqha.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const bucketName = "product-media";

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filename, buffer, {
            contentType: mime,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filename);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            filename,
            storage: "supabase",
          });
        }
        console.warn("Supabase storage upload failed, falling back to local storage:", uploadError.message);
      } catch (sbErr) {
        console.warn("Supabase client error:", sbErr);
      }
    }

    // 2. Safe local storage fallback
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      storage: "local",
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process image upload." },
      { status: 500 }
    );
  }
}
