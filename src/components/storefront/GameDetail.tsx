'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Heart,
  HardDrive,
  Calendar,
  Zap,
  Play,
  Star,
  ThumbsUp,
  Film,
  Maximize2,
  Minimize2,
  Volume2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { GameItem } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';
import { translations, genreTranslations } from '@/lib/i18n';
import { formatNumber } from '@/lib/utils';
import GameCard from './GameCard';

interface GameDetailProps {
  game: GameItem & { reviews?: any[] };
  similarGames: GameItem[];
  ratePerGB: number;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch?.[1]) return embedMatch[1];
  const watchMatch = url.match(/[?&]v=([^?&/]+)/);
  if (watchMatch?.[1]) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch?.[1]) return shortMatch[1];
  return null;
}

function toYouTubeEmbedUrl(url: string): string {
  const id = extractYouTubeId(url);
  if (id) {
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  }
  return url;
}

export default function GameDetail({
  game,
  similarGames,
  ratePerGB,
}: GameDetailProps) {
  const {
    addItem,
    removeItem,
    isInCart,
    wishlistIds,
    toggleWishlist,
    addRecentlyViewed,
  } = useCartStore();
  const { locale } = useThemeStore();
  const t = translations[locale];
  const isAr = locale === 'ar';
  const { user } = useAuth();

  const [reviews, setReviews] = useState<any[]>(game.reviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const reviewsListRef = useRef<HTMLDivElement | null>(null);
  const playerFrameRef = useRef<HTMLDivElement | null>(null);

  const ytId = extractYouTubeId(game.trailerUrl || '');
  const [posterSrc, setPosterSrc] = useState<string>(
    ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : game.coverImage
  );

  const added = isInCart(game.id);
  const wished = wishlistIds.includes(game.id);

  useEffect(() => {
    addRecentlyViewed(game.id);
  }, [game.id, addRecentlyViewed]);

  useEffect(() => {
    const id = extractYouTubeId(game.trailerUrl || '');
    setPosterSrc(id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : game.coverImage);
  }, [game.trailerUrl, game.coverImage]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!playerFrameRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerFrameRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          gameId: game.id,
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setComment('');
        setTimeout(() => {
          reviewsListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }, 80);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    await fetch(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incrementHelpful: true }),
    });
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );
  };

  const scrollReviews = (direction: 'up' | 'down') => {
    if (!reviewsListRef.current) return;
    const offset = direction === 'up' ? -220 : 220;
    reviewsListRef.current.scrollBy({ top: offset, behavior: 'smooth' });
  };

  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const isDirectVideo =
    game.trailerUrl &&
    (game.trailerUrl.endsWith('.mp4') ||
      game.trailerUrl.endsWith('.webm') ||
      game.trailerUrl.endsWith('.ogg'));

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Back button */}
        <Link
          href="/#library"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[#CCFF00]"
        >
          <BackIcon className="h-4 w-4" />
          {t.backToLibrary}
        </Link>

        {/* Top 2-Column Hero Grid: Cover Image + Game Info */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left: Large Cover Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[16px] border border-[var(--border)] bg-[#111111] shadow-2xl">
              <img
                src={game.coverImage}
                alt={game.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-4 top-4 flex items-center gap-2" dir="ltr">
                <span className="rounded-[6px] bg-[#CCFF00] px-3 py-1 text-xs font-extrabold text-black">
                  {game.releaseYear}
                </span>
                {game.isOP && (
                  <span className="rounded-[6px] border border-[#CCFF00] bg-black/80 px-2.5 py-1 text-xs font-black text-[#CCFF00]">
                    OP EDITION
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Game Info, Price, Specs, Description */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              {/* Genres */}
              <div className="flex flex-wrap items-center gap-2">
                {game.genre.map((g) => (
                  <Link
                    key={g}
                    href={`/games?genre=${encodeURIComponent(g)}`}
                    className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-semibold text-[#CCFF00] hover:border-[#CCFF00]"
                  >
                    {isAr ? genreTranslations[g] || g : g}
                  </Link>
                ))}
                <span className="ms-2 inline-flex items-center gap-1 text-xs font-bold text-[#CCFF00]">
                  <Star className="h-3.5 w-3.5 fill-[#CCFF00]" />
                  {game.avgRating || 4.8} ({reviews.length} {t.reviewsLabel})
                </span>
              </div>

              <h1
                className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
                dir="ltr"
              >
                {game.name}
              </h1>

              <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                {t.gameDetailSub}
              </p>

              {/* Price + Add to Cart Card */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-5">
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                    {t.driveLoadPrice}
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-[var(--text-primary)]">
                      {formatNumber(game.price)}
                    </span>
                    <span className="text-sm font-bold text-[#CCFF00]">
                      {t.egpCurrency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(game.id)}
                    aria-label={t.wishlist}
                    className={`flex h-12 w-12 items-center justify-center rounded-[8px] border transition-colors ${
                      wished
                        ? 'border-[#CCFF00] bg-[#CCFF00] text-black'
                        : 'border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[#CCFF00]'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${wished ? 'fill-black' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      added
                        ? removeItem(game.id)
                        : addItem({
                            id: game.id,
                            name: game.name,
                            coverImage: game.coverImage,
                            sizeGB: game.sizeGB,
                            price: game.price,
                            releaseYear: game.releaseYear,
                            genre: game.genre,
                          })
                    }
                    className={`inline-flex h-12 items-center gap-2 rounded-[8px] px-8 text-sm font-extrabold transition-all ${
                      added
                        ? 'border border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00]'
                        : 'bg-[#CCFF00] text-black hover:bg-[#B8E600] hover:scale-[1.02]'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{t.addedToCart.replace('✓ ', '')}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>{t.addToDrive.replace('+ ', '')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Specs Grid: Storage Size | Released Year | Rate */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <HardDrive className="h-4 w-4 text-[#CCFF00]" />
                    <span>{t.storageSize}</span>
                  </div>
                  <p className="mt-1.5 text-xl font-bold text-[var(--text-primary)]">
                    {formatNumber(game.sizeGB)} {t.gbUnit}
                  </p>
                </div>

                <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Calendar className="h-4 w-4 text-[#CCFF00]" />
                    <span>{t.releasedYear}</span>
                  </div>
                  <p className="mt-1.5 text-xl font-bold text-[var(--text-primary)]">
                    {game.releaseYear}
                  </p>
                </div>

                <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Zap className="h-4 w-4 text-[#CCFF00]" />
                    <span>{t.rateLabel}</span>
                  </div>
                  <p className="mt-1.5 text-xl font-bold text-[#CCFF00]">
                    {formatNumber(ratePerGB)} {t.egpCurrency} / {t.gbUnit}
                  </p>
                </div>
              </div>

              {/* ABOUT THE GAME */}
              <div className="mt-8 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
                  {t.aboutTheGame}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.8] text-[var(--text-secondary)]">
                  {game.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH (100% 16:9 UNCLIPPED) GIGADROP CINEMA VIDEO MEDIA PLAYER */}
        {game.trailerUrl && (
          <div className="mt-14 w-full">
            {/* Section Title */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#CCFF00]/15 text-[#CCFF00]">
                  <Film className="h-4 w-4" />
                </span>
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#CCFF00]">
                    {t.watchGameTrailer}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                    {isAr ? 'العرض الرسمي للعبة بالحجم الكامل' : 'Full-Width Official Gameplay Trailer'}
                  </h2>
                </div>
              </div>
            </div>

            {/* Full-Width 1200px Outer Media Player Frame */}
            <div
              ref={playerFrameRef}
              className="w-full overflow-hidden rounded-[16px] border border-[var(--border)] bg-[#0A0A0A] shadow-[0_20px_60px_rgba(0,0,0,0.75)] flex flex-col"
            >
              {/* Top Media Player Bar */}
              <div
                dir="ltr"
                className="flex shrink-0 items-center justify-between border-b border-[#222222] bg-[#121212] px-5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#FF4444]/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-[#CCFF00]" />
                  </div>
                  <span className="truncate text-xs sm:text-sm font-bold text-white/90">
                    {game.name} — Official 4K / 1080p60 Trailer
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="rounded-md bg-[#CCFF00]/15 border border-[#CCFF00]/40 px-2.5 py-0.5 text-[11px] font-extrabold text-[#CCFF00]">
                    1080p60 HD
                  </span>
                  {showTrailer && (
                    <button
                      type="button"
                      onClick={() => setShowTrailer(false)}
                      className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-bold text-white hover:bg-[#FF4444] hover:text-white"
                    >
                      {isAr ? 'إيقاف العرض' : 'Stop'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    title={isAr ? 'ملء الشاشة بالكامل' : 'Full Screen'}
                    className="inline-flex items-center gap-1 rounded-md bg-[#CCFF00]/15 border border-[#CCFF00]/40 px-2.5 py-1 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 className="h-3.5 w-3.5" />
                        <span>{isAr ? 'تصغير' : 'Exit Fullscreen'}</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>{isAr ? 'ملء الشاشة' : 'Fullscreen'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bulletproof 16:9 Video Viewport (padding-top: 56.25% guarantees full height & width!) */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: isFullscreen ? '0' : '56.25%',
                  height: isFullscreen ? 'calc(100vh - 52px)' : '0',
                  backgroundColor: '#000000',
                  overflow: 'hidden',
                }}
              >
                {showTrailer ? (
                  isDirectVideo ? (
                    <video
                      src={game.trailerUrl}
                      controls
                      autoPlay
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <iframe
                      src={toYouTubeEmbedUrl(game.trailerUrl)}
                      title={`${game.name} Trailer`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0,
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  )
                ) : (
                  <div
                    onClick={() => setShowTrailer(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setShowTrailer(true);
                    }}
                    className="group cursor-pointer"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {/* Full-width Widescreen Poster Image */}
                    <img
                      src={posterSrc}
                      alt={game.name}
                      onError={() => {
                        if (posterSrc !== game.coverImage) {
                          setPosterSrc(game.coverImage);
                        }
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Cinematic Dark Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background:
                          'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.78) 100%)',
                      }}
                    />

                    {/* Center Play Button Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        zIndex: 10,
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="absolute h-24 w-24 animate-ping rounded-full bg-[#CCFF00]/25" />
                        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#CCFF00] text-black shadow-[0_0_40px_rgba(204,255,0,0.8)] transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-9 w-9 fill-black ms-1" />
                        </span>
                      </div>

                      <span className="rounded-full border border-[#CCFF00]/40 bg-black/80 px-5 py-2 text-sm font-extrabold text-white shadow-lg backdrop-blur-md transition-colors group-hover:border-[#CCFF00] group-hover:text-[#CCFF00]">
                        {t.watchTrailerBtn}
                      </span>
                    </div>

                    {/* Bottom Media Player Scrubber / Control Bar */}
                    <div
                      dir="ltr"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 20,
                      }}
                      className="flex flex-col gap-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-6 pt-8 pb-4"
                    >
                      {/* Progress Timeline Bar */}
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                        <div className="h-full w-1/3 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]" />
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between text-xs font-semibold text-white/80">
                        <div className="flex items-center gap-3.5">
                          <Play className="h-4 w-4 fill-[#CCFF00] text-[#CCFF00]" />
                          <Volume2 className="h-4 w-4 text-white/80" />
                          <span className="font-mono text-xs text-white/70">
                            00:00 / 02:59
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {ytId && (
                            <a
                              href={`https://www.youtube.com/watch?v=${ytId}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-[11px] text-white hover:bg-[#CCFF00] hover:text-black"
                            >
                              <span>YouTube</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          <Maximize2 className="h-4 w-4 text-white/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rate & Review Section with Scrollable Replies List & Side Slider */}
        <div className="mt-16 border-t border-[var(--border)] pt-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            {/* Left/Start: Add a Reply / Review Form */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
                {t.playerFeedback}
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[var(--text-primary)]">
                {t.rateAndReview}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {t.rateAndReviewSub}
              </p>

              <form
                onSubmit={handleReviewSubmit}
                className="mt-6 rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4 shadow-lg"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-secondary)]">
                    {t.yourRating}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating
                              ? 'fill-[#CCFF00] text-[#CCFF00]'
                              : 'text-[var(--text-muted)]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]">
                    {t.yourReview}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.reviewPlaceholder}
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] p-3.5 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full rounded-[8px] bg-[#CCFF00] py-3 text-sm font-extrabold text-black transition-all hover:bg-[#B8E600]"
                >
                  {submittingReview ? t.submittingReview : t.postReview}
                </button>
              </form>
            </div>

            {/* Right/End: Scrollable Replies List with Side Overflow Slider & Up/Down Controls */}
            <div className="lg:col-span-7">
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-lg">
                {/* Replies List Header + Side Slider Controls */}
                <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCFF00]/15 text-[#CCFF00]">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        {isAr ? 'قائمة الردود والتقييمات' : 'Player Replies & Reviews'}
                      </h3>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {isAr
                          ? `إجمالي الردود (${reviews.length}) — اسحب الشريط الجانبي لمشاهدة باقي الردود`
                          : `Total replies (${reviews.length}) — Scroll side slider to view more`}
                      </span>
                    </div>
                  </div>

                  {/* Quick Up / Down Slider Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => scrollReviews('up')}
                      title={isAr ? 'التمرير لأعلى' : 'Scroll Up'}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors hover:border-[#CCFF00] hover:text-[#CCFF00]"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollReviews('down')}
                      title={isAr ? 'التمرير لأسفل' : 'Scroll Down'}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors hover:border-[#CCFF00] hover:text-[#CCFF00]"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Overflow Scrollable Container with Prominent Lime Side Scrollbar */}
                {reviews.length === 0 ? (
                  <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-8 text-center text-sm text-[var(--text-secondary)]">
                    {t.noReviewsYet}
                  </div>
                ) : (
                  <div
                    ref={reviewsListRef}
                    className="giga-reviews-scroll max-h-[380px] space-y-3.5 overflow-y-auto pe-2.5 scroll-smooth"
                  >
                    {reviews.map((rev, idx) => (
                      <div
                        key={rev.id || idx}
                        className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-colors hover:border-[#CCFF00]/40"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#CCFF00]/20 text-sm font-extrabold text-[#CCFF00]">
                              {rev.user?.name?.[0]?.toUpperCase() || 'G'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-[var(--text-primary)]">
                                  {rev.user?.name || (isAr ? 'لاعب من القاهرة' : 'Cairo Gamer')}
                                </p>
                                <span className="rounded bg-[#CCFF00]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#CCFF00]">
                                  #{reviews.length - idx}
                                </span>
                              </div>
                              <div className="mt-0.5 flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < rev.rating
                                        ? 'fill-[#CCFF00] text-[#CCFF00]'
                                        : 'text-[var(--text-muted)]'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleHelpful(rev.id)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[#CCFF00] hover:text-[#CCFF00]"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>
                              {t.helpfulBtn} ({rev.helpfulCount || 0})
                            </span>
                          </button>
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Games Carousel */}
        {similarGames.length > 0 && (
          <div className="mt-16 border-t border-[var(--border)] pt-12">
            <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
              {t.youMightAlsoLike}
            </span>
            <h2 className="mt-1 mb-6 text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {t.similarGamesTitle}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarGames.map((sim) => (
                <GameCard key={sim.id} game={sim} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
