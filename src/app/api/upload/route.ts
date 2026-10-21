export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { requireAdminSession } from '@/lib/adminGuard';
import { isValidHttpUrl } from '@/lib/security';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

export async function POST(req: Request) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const contentType = req.headers.get('content-type') || '';

    // Handle multipart/form-data file upload from computer
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'لم يتم اختيار ملف صورة (No image file provided)' },
          { status: 400 }
        );
      }

      // 1. File Size Validation (Prevent DoS / Storage Exhaustion)
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'حجم الصورة كبير جداً، الحد الأقصى 5 ميجابايت (Max file size: 5MB)' },
          { status: 400 }
        );
      }

      // 2. MIME Type Validation (Strictly block SVG and non-images)
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: 'نوع الملف غير مدعوم. يرجى اختيار JPG, PNG, WEBP, أو AVIF فقط' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename and keep safe extension
      const originalName = file.name || 'cover.jpg';
      const ext = path.extname(originalName).toLowerCase() || '.jpg';
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
      if (!allowedExts.includes(ext)) {
        return NextResponse.json(
          { error: 'امتداد الملف غير مسموح به (Forbidden extension)' },
          { status: 400 }
        );
      }

      const safeExt = ext;
      const baseName = path
        .basename(originalName, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 40) || 'game';

      const fileName = `${Date.now()}-${baseName}${safeExt}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'games');

      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/games/${fileName}`;
      return NextResponse.json({
        url: publicUrl,
        fileName,
        size: file.size,
      });
    }

    // Fallback for JSON body with imageUrl
    const body = await req.json();
    const { imageUrl } = body;
    if (imageUrl && !isValidHttpUrl(imageUrl)) {
      return NextResponse.json(
        { error: 'رابط الصورة غير صالح (Invalid image URL protocol)' },
        { status: 400 }
      );
    }
    return NextResponse.json({
      url:
        imageUrl ||
        'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900_2x.jpg',
    });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json({ error: 'فشل رفع الصورة (Upload failed)' }, { status: 500 });
  }
}
