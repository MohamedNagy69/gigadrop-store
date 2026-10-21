import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { requireAdminSession } from '@/lib/adminGuard';

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

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename and keep extension
      const originalName = file.name || 'cover.jpg';
      const ext = path.extname(originalName).toLowerCase() || '.jpg';
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'];
      const safeExt = allowedExts.includes(ext) ? ext : '.jpg';

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
