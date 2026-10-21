'use client';

import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Star, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function AdminReviewsPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [reviews, setReviews] = useState<any[]>([]);

  const loadReviews = async () => {
    const res = await fetch('/api/reviews?all=true');
    const data = await res.json();
    if (data.reviews) setReviews(data.reviews);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const toggleVisibility = async (rev: any) => {
    await fetch(`/api/reviews/${rev.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !rev.isVisible }),
    });
    loadReviews();
  };

  const deleteReview = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'مراجعة تقييمات اللاعبين' : 'MODERATION'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr
            ? `إدارة التقييمات والمراجعات (${reviews.length})`
            : `Reviews Management (${reviews.length})`}
        </Typography>
      </div>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'اللعبة' : 'Game'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'العميل' : 'Customer'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'التقييم' : 'Rating'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'التعليق' : 'Comment'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الظهور' : 'Visibility'}
                </TableCell>
                <TableCell align="right" sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'إجراءات' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{r.game?.name}</TableCell>
                  <TableCell>{r.user?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5 text-[#CCFF00]">
                      <Star className="h-3.5 w-3.5 fill-[#CCFF00]" />
                      <span className="font-bold">{r.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <p className="line-clamp-2 text-xs text-[var(--text-secondary)]">
                      {r.comment}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        isAr
                          ? r.isVisible
                            ? 'ظاهر'
                            : 'مخفي'
                          : r.isVisible
                          ? 'VISIBLE'
                          : 'HIDDEN'
                      }
                      size="small"
                      sx={{
                        bgcolor: r.isVisible
                          ? 'rgba(204,255,0,0.2)'
                          : 'rgba(255,68,68,0.2)',
                        color: r.isVisible ? '#CCFF00' : '#FF4444',
                        fontWeight: 700,
                        fontSize: '10px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleVisibility(r)}
                        className="rounded border border-[var(--border)] p-1.5 text-xs hover:border-[#CCFF00]"
                        title={isAr ? 'إظهار / إخفاء التقييم' : 'Toggle Visibility'}
                      >
                        {r.isVisible ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 text-[#CCFF00]" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteReview(r.id)}
                        className="rounded border border-[var(--border)] p-1.5 text-[#FF4444] hover:border-[#FF4444]"
                        title={isAr ? 'حذف التقييم' : 'Delete Review'}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
