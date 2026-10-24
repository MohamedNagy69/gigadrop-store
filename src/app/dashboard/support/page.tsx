'use client';

import React, { useEffect, useState } from 'react';
import WhatsAppChatView from '@/components/chat/WhatsAppChatView';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/stores/themeStore';
import { Headphones, ShieldCheck, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';

export default function CustomerSupportPage() {
  const { user: sessionUser } = useAuth();
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportWhatsapp, setSupportWhatsapp] = useState('+201009998877');

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        setSelectedTicket((prev: any) => {
          if (prev) {
            const found = data.tickets.find((t: any) => t.id === prev.id);
            if (found) return found;
          }
          return data.tickets[0] || null;
        });
      }
    } catch {
      // ignore poll error
    } finally {
      setLoading(false);
    }
  };

  // Load site settings to get support WhatsApp number
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.contactWhatsapp) {
          setSupportWhatsapp(data.settings.contactWhatsapp);
        }
      })
      .catch(() => {});
  }, []);

  // Polling every 2.5s to keep messages live
  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (text: string, mediaUrl?: string, replyTo?: any) => {
    if (selectedTicket) {
      const res = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mediaUrl,
          replyToSender: replyTo?.sender,
          replyToText: replyTo?.text,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          setSelectedTicket(data.ticket);
          loadTickets();
        }
      }
    } else {
      // First message from customer: create ticket
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `محادثة دعم — ${sessionUser?.name || 'عميل'}`,
          message: text,
          mediaUrl,
          priority: 'HIGH',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          setSelectedTicket(data.ticket);
          loadTickets();
        }
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedTicket) return;
    const res = await fetch(
      `/api/tickets/${selectedTicket.id}/messages?messageId=${messageId}`,
      { method: 'DELETE' }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.ticket) {
        setSelectedTicket(data.ticket);
        loadTickets();
      }
    }
  };

  // Virtual ticket for first-time customer before first message is sent
  const activeTicket = selectedTicket || {
    id: 'new-thread',
    subject: isAr ? 'شات الدعم الفني المباشر' : 'Live Support Chat',
    status: 'OPEN',
    messages: [
      {
        id: 'welcome-msg',
        senderId: 'admin',
        message: isAr
          ? 'أهلاً بك في GigaDrop (أحمد ستور) 🎮\nنحن متصلون الآن لمساعدتك في تجهيز الهارد ديسك، اختيار الألعاب، أو الاستفسار عن الشحن والتوصيل. اكتب رسالتك وسنرد عليك فوراً!'
          : 'Welcome to GigaDrop (Ahmed Store) 🎮\nWe are online to assist you with hard drive setup, game selections, or delivery inquiries. Send your message and we will reply instantly!',
        isAdmin: true,
        createdAt: new Date().toISOString(),
        isRead: true,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
              {isAr ? 'شات الدعم الفني المباشر (مثل واتساب)' : 'Live Support Chat (WhatsApp Style)'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              {isAr
                ? 'تواصل مباشر مع أحمد ستور وفريق العمل مع إمكانية إرسال الصور وسكرين شوت الدفع'
                : 'Direct messaging with Ahmed Store with screenshot & receipt attachment support'}
            </p>
          </div>
        </div>

        {tickets.length > 1 && (
          <div className="flex items-center gap-1.5">
            {tickets.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTicket(t)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                  selectedTicket?.id === t.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-emerald-500'
                }`}
              >
                {isAr ? `محادثة #${idx + 1}` : `Chat #${idx + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main WhatsApp Window */}
      <div className="h-[75vh] min-h-[560px]">
        <WhatsAppChatView
          ticket={activeTicket}
          currentUserId={sessionUser?.id}
          isAdminView={false}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          supportWhatsappNumber={supportWhatsapp}
          customerWhatsappNumber={(sessionUser as any)?.whatsapp || sessionUser?.phone}
          customerName={sessionUser?.name}
          customerOrder={activeTicket?.order}
        />
      </div>
    </div>
  );
}
