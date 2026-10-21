'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Paper, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, Upload, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { ALL_GENRES, calculatePrice, formatNumber } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { genreTranslations } from '@/lib/i18n';

export default function EditGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [sizeGB, setSizeGB] = useState(50);
  const [releaseYear, setReleaseYear] = useState(2024);
  const [status, setStatus] = useState('ACTIVE');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOP, setIsOP] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/games/${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.game) {
          const g = data.game;
          setName(g.name);
          setDescription(g.description || '');
          setSelectedGenres(g.genre || []);
          setCoverImage(g.coverImage);
          setTrailerUrl(g.trailerUrl || '');
          setSizeGB(g.sizeGB);
          setReleaseYear(g.releaseYear);
          setStatus(g.status);
          setIsFeatured(Boolean(g.isFeatured));
          setIsOP(Boolean(g.isOP));
        }
      });
  }, [gameId]);

  const toggleGenre = (g: string) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter((x) => x !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setUploadError('');
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setUploadError(data.error || (isAr ? 'فشل رفع الصورة' : 'Image upload failed'));
      } else {
        setCoverImage(data.url);
        setUploadedFileName(file.name);
      }
    } catch {
      setUploadError(isAr ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/games/${gameId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        genre: selectedGenres,
        coverImage,
        trailerUrl,
        sizeGB: Number(sizeGB),
        releaseYear: Number(releaseYear),
        status,
        isFeatured,
        isOP,
      }),
    });
    setSaving(false);
    router.push('/admin/games');
    router.refresh();
  };

  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/games"
        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[#CCFF00]"
      >
        <BackIcon className="h-4 w-4" />
        {isAr ? 'العودة إلى إدارة الألعاب' : 'Back to Game Management'}
      </Link>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>
          {isAr ? `تعديل بيانات اللعبة: ${name}` : `Edit Game: ${name}`}
        </Typography>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                {isAr ? 'اسم اللعبة' : 'Game Title'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                  {isAr ? 'المساحة بالجيجابايت (GB)' : 'Size in GB'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={sizeGB}
                  onChange={(e) => setSizeGB(Number(e.target.value))}
                  className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                  {isAr ? 'السعر المحسوب' : 'Calculated Price'}
                </label>
                <div className="flex h-[42px] items-center rounded-[8px] border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3.5 text-sm font-extrabold text-[#CCFF00]">
                  {formatNumber(calculatePrice(sizeGB, 1.0))} {isAr ? 'ج.م' : 'EGP'}
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image Upload from Computer + Live Preview */}
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-5">
            <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[#CCFF00]">
              {isAr ? 'صورة غلاف اللعبة (رفع من الكمبيوتر أو رابط)' : 'Game Cover Image (Upload from PC or URL)'}
            </label>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 items-center">
              <div className="md:col-span-8 space-y-3">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-[var(--border)] bg-[var(--bg-card)] p-6 text-center transition-all hover:border-[#CCFF00] hover:bg-[#CCFF00]/[0.04]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />

                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="h-8 w-8 animate-spin text-[#CCFF00]" />
                      <span className="text-xs font-bold text-[#CCFF00]">
                        {isAr ? 'جاري رفع الصورة من جهازك...' : 'Uploading image from your computer...'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#CCFF00]/15 text-[#CCFF00] transition-transform group-hover:scale-110">
                        <Upload className="h-6 w-6" />
                      </span>
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {isAr
                          ? 'اضغط هنا لرفع صورة جديدة من الكمبيوتر أو اسحب الصورة وأفلتها هنا'
                          : 'Click to upload a new image from your computer or drag & drop here'}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">
                        PNG, JPG, WEBP, AVIF
                      </p>
                      {uploadedFileName && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#CCFF00]/15 px-3 py-1 text-xs font-bold text-[#CCFF00]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>
                            {isAr ? `تم الرفع: ${uploadedFileName}` : `Uploaded: ${uploadedFileName}`}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {uploadError && (
                  <p className="text-xs font-semibold text-[#FF4444]">{uploadError}</p>
                )}

                <div>
                  <label className="mb-1 block text-[11px] text-[var(--text-secondary)]">
                    {isAr ? 'مسار أو رابط الصورة الحالي:' : 'Current Image Path / URL:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    dir="ltr"
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col items-center">
                <span className="mb-2 flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)]">
                  <ImageIcon className="h-3.5 w-3.5 text-[#CCFF00]" />
                  {isAr ? 'معاينة غلاف اللعبة' : 'Live Cover Preview'}
                </span>
                <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-[12px] border border-[var(--border)] bg-black shadow-xl">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-[var(--text-secondary)]">
              {isAr ? 'التصنيفات' : 'Genres'}
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                    selectedGenres.includes(g)
                      ? 'bg-[#CCFF00] text-black font-bold'
                      : 'border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                  }`}
                >
                  {isAr ? genreTranslations[g] || g : g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
              {isAr ? 'وصف اللعبة' : 'Description'}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] p-3.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                {isAr ? 'رابط فيديو الإعلان (YouTube)' : 'YouTube Trailer URL'}
              </label>
              <input
                type="text"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                dir="ltr"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                {isAr ? 'سنة الإصدار' : 'Release Year'}
              </label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                {isAr ? 'حالة النشر' : 'Status'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
              >
                <option value="ACTIVE">{isAr ? 'منشورة (ACTIVE)' : 'ACTIVE'}</option>
                <option value="DRAFT">{isAr ? 'مسودة (DRAFT)' : 'DRAFT'}</option>
                <option value="ARCHIVED">{isAr ? 'مؤرشفة (ARCHIVED)' : 'ARCHIVED'}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 accent-[#CCFF00]"
              />
              {isAr ? 'لعبة مميزة (Featured)' : 'Featured'}
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold">
              <input
                type="checkbox"
                checked={isOP}
                onChange={(e) => setIsOP(e.target.checked)}
                className="h-4 w-4 accent-[#CCFF00]"
              />
              {isAr ? 'شارة OP' : 'OP Badge'}
            </label>
          </div>

          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="rounded-[8px] bg-[#CCFF00] px-8 py-3.5 text-sm font-extrabold text-black transition-all hover:bg-[#B8E600] disabled:opacity-50"
          >
            {saving
              ? isAr
                ? 'جاري حفظ التعديلات...'
                : 'Updating...'
              : isAr
              ? 'حفظ التغييرات ›'
              : 'Save Changes ›'}
          </button>
        </form>
      </Paper>
    </div>
  );
}
