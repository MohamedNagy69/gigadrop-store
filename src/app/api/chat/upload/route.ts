export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: 'يرجى تسجيل الدخول لرفع الصور (Unauthorized)' },
        { status: 401 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type, multipart/form-data required' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم اختيار ملف صورة (No image file provided)' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'حجم الصورة كبير جداً، الحد الأقصى 5 ميجابايت (Max file size: 5MB)' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. يرجى اختيار JPG, PNG, WEBP, أو GIF فقط' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'screenshot.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: 'امتداد الملف غير مسموح به (Forbidden extension)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeBaseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 30) || 'chat-img';

    const fileName = `chat-${Date.now()}-${safeBaseName}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'chat');

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/chat/${fileName}`;
    return NextResponse.json({
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في رفع الصورة (Failed to upload chat image)' },
      { status: 500 }
    );
  }
}
