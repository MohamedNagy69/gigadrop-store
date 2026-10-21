'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Plus, Edit, Trash2, Download, Search } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import { genreTranslations } from '@/lib/i18n';

export default function AdminGamesPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [games, setGames] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const loadGames = async () => {
    const res = await fetch('/api/games?all=true');
    const data = await res.json();
    if (data.games) setGames(data.games);
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        isAr
          ? `هل أنت متأكد من حذف اللعبة "${name}" من المكتبة؟`
          : `Delete "${name}" from library?`
      )
    )
      return;
    await fetch(`/api/games/${id}`, { method: 'DELETE' });
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  const handleToggleStatus = async (game: any) => {
    const nextStatus = game.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    await fetch(`/api/games/${game.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, status: nextStatus } : g))
    );
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Genres,SizeGB,PriceEGP,ReleaseYear,Status,Featured,OP'];
    const rows = games.map(
      (g) =>
        `"${g.id}","${g.name.replace(/"/g, '""')}","${g.genre.join('|')}",${g.sizeGB},${
          g.price
        },${g.releaseYear},${g.status},${g.isFeatured},${g.isOP}`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gigadrop-games-catalog.csv';
    a.click();
  };

  const filtered = games.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.genre.some((x: string) => x.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            {isAr ? 'إدارة كتالوج الألعاب' : 'CATALOG CRUD'}
          </span>
          <Typography variant="h4" fontWeight={800}>
            {isAr
              ? `إدارة الألعاب (${games.length} لعبة)`
              : `Game Management (${games.length} titles)`}
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:border-[#CCFF00]"
          >
            <Download className="h-4 w-4 text-[#CCFF00]" />
            {isAr ? 'تصدير CSV' : 'Export CSV'}
          </button>
          <Link
            href="/admin/games/new"
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#CCFF00] px-4 py-2.5 text-xs font-extrabold text-black hover:bg-[#B8E600]"
          >
            <Plus className="h-4 w-4" />
            {isAr ? 'إضافة لعبة جديدة' : 'Add New Game'}
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            isAr
              ? 'ابحث في الكتالوج باسم اللعبة أو التصنيف...'
              : 'Search catalog by title or genre...'
          }
          className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] py-2.5 ps-10 pe-4 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
        />
      </div>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الغلاف' : 'Cover'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'اسم اللعبة' : 'Game Title'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'التصنيف' : 'Genre'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'المساحة' : 'Size (GB)'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'السعر' : 'Price (EGP)'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'السنة' : 'Year'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الشارات' : 'Badges'}
                </TableCell>
                <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'الحالة' : 'Status'}
                </TableCell>
                <TableCell align="right" sx={{ color: '#CCFF00', fontWeight: 700 }}>
                  {isAr ? 'إجراءات' : 'Actions'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((game) => (
                <TableRow key={game.id} hover>
                  <TableCell>
                    <img
                      src={game.coverImage}
                      alt={game.name}
                      className="h-12 w-9 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{game.name}</TableCell>
                  <TableCell>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {game.genre
                        .slice(0, 2)
                        .map((g: string) => (isAr ? genreTranslations[g] || g : g))
                        .join('، ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatNumber(game.sizeGB)} {isAr ? 'جيجا' : 'GB'}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#CCFF00' }}>
                    {formatNumber(game.price)} {isAr ? 'ج.م' : 'EGP'}
                  </TableCell>
                  <TableCell>{game.releaseYear}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {game.isFeatured && (
                        <span className="rounded bg-[#CCFF00] px-1.5 py-0.5 text-[10px] font-bold text-black">
                          {isAr ? 'مميزة' : 'Featured'}
                        </span>
                      )}
                      {game.isOP && (
                        <span className="rounded border border-[#CCFF00] px-1.5 py-0.5 text-[10px] font-bold text-[#CCFF00]">
                          OP
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(game)}
                    >
                      <Chip
                        label={
                          isAr
                            ? game.status === 'ACTIVE'
                              ? 'منشورة'
                              : 'مسودة'
                            : game.status
                        }
                        size="small"
                        sx={{
                          bgcolor:
                            game.status === 'ACTIVE'
                              ? 'rgba(204,255,0,0.2)'
                              : 'rgba(153,153,153,0.2)',
                          color: game.status === 'ACTIVE' ? '#CCFF00' : '#999',
                          fontWeight: 700,
                          fontSize: '10px',
                          cursor: 'pointer',
                        }}
                      />
                    </button>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/games/${game.id}/edit`}
                        className="rounded p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[#CCFF00]"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(game.id, game.name)}
                        className="rounded p-1.5 text-[var(--text-secondary)] hover:bg-[#FF4444]/10 hover:text-[#FF4444]"
                      >
                        <Trash2 className="h-4 w-4" />
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
