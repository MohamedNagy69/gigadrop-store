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
import { Plus, Shield } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function AdminUsersPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [admins, setAdmins] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ADMIN');

  const loadAdmins = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (data.admins) setAdmins(data.admins);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role }),
    });
    setName('');
    setEmail('');
    loadAdmins();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'إدارة الصلاحيات والمشرفين' : 'ROLE-BASED ACCESS CONTROL'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr ? 'المشرفين وفريق العمل' : 'Admin & Staff Users'}
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Paper sx={{ p: 3.5, borderRadius: 3 }} className="lg:col-span-4">
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {isAr ? 'إضافة مشرف جديد' : 'Add Staff Member'}
          </Typography>
          <form onSubmit={handleCreateAdmin} className="space-y-3">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? 'اسم المشرف' : 'Staff Name'}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@gigadrop.eg"
              dir="ltr"
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
            >
              <option value="SUPER_ADMIN">
                {isAr ? 'مدير عام (SUPER_ADMIN)' : 'SUPER_ADMIN'}
              </option>
              <option value="ADMIN">{isAr ? 'مشرف (ADMIN)' : 'ADMIN'}</option>
              <option value="SUPPORT">
                {isAr ? 'دعم فني (SUPPORT)' : 'SUPPORT'}
              </option>
            </select>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#CCFF00] py-2.5 text-xs font-extrabold text-black"
            >
              <Plus className="h-4 w-4" />
              {isAr ? 'إنشاء حساب المشرف' : 'Create Staff User'}
            </button>
          </form>
        </Paper>

        <Paper sx={{ p: 3.5, borderRadius: 3 }} className="lg:col-span-8">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'الاسم' : 'Name'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'البريد الإلكتروني' : 'Email'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'الصلاحية' : 'Role'}
                  </TableCell>
                  <TableCell sx={{ color: '#CCFF00', fontWeight: 700 }}>
                    {isAr ? 'الحالة' : 'Status'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{a.name}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 rounded bg-[#CCFF00]/15 px-2 py-0.5 text-[11px] font-bold text-[#CCFF00]">
                        <Shield className="h-3 w-3" />
                        {a.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          isAr
                            ? a.isActive
                              ? 'نشط'
                              : 'معطل'
                            : a.isActive
                            ? 'ACTIVE'
                            : 'DISABLED'
                        }
                        size="small"
                        sx={{
                          bgcolor: 'rgba(204,255,0,0.2)',
                          color: '#CCFF00',
                          fontWeight: 700,
                          fontSize: '10px',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}
