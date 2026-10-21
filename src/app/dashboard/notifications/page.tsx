'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { Bell, CheckCheck } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function NotificationsPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    if (data.notifications) {
      setNotifications(data.notifications);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    await fetch('/api/notifications/read', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    for (const n of notifications) {
      if (!n.isRead) {
        await fetch('/api/notifications/read', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: n.id }),
        });
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
            {isAr ? 'تنبيهات لحظية' : 'REAL-TIME ALERTS'}
          </span>
          <Typography variant="h4" fontWeight={800}>
            {isAr ? 'الإشعارات' : 'Notifications'}
          </Typography>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#CCFF00] px-4 py-2 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
        >
          <CheckCheck className="h-4 w-4" />
          {isAr ? 'تحديد الكل كمقروء' : 'Mark All Read'}
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Paper
            key={n.id}
            sx={{
              p: 3,
              borderRadius: 3,
              borderColor: n.isRead ? undefined : '#CCFF00',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    n.isRead
                      ? 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
                      : 'bg-[#CCFF00] text-black'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span className="rounded bg-[#CCFF00] px-1.5 py-0.5 text-[10px] font-extrabold text-black">
                        {isAr ? 'جديد' : 'NEW'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {n.message}
                  </p>
                  <span className="mt-1.5 block text-[10px] text-[var(--text-muted)]">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkRead(n.id)}
                  className="text-xs font-bold text-[#CCFF00] hover:underline"
                >
                  {isAr ? 'تحديد كمقروء' : 'Mark read'}
                </button>
              )}
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
}
