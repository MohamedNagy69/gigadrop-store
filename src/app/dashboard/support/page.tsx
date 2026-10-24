'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Headphones,
  Send,
  Reply,
  Trash2,
  X,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useAuth } from '@/hooks/useAuth';

function parseQuotedMessage(raw: string) {
  const match = raw.match(/^\[\[QUOTE:([^|]+)\|([\s\S]*?)\]\]\n([\s\S]*)$/);
  if (!match) {
    return { quoteSender: null, quoteText: null, body: raw };
  }
  return {
    quoteSender: match[1],
    quoteText: match[2],
    body: match[3],
  };
}

export default function CustomerSupportPage() {
  const { locale } = useThemeStore();
  const { user: sessionUser } = useAuth();
  const isAr = locale === 'ar';

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    sender: string;
    text: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      if (!res.ok) return;
      const data = await res.json();
      if (data.tickets && data.tickets.length > 0) {
        setTickets(data.tickets);
        const urlTicketId =
          typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('ticketId')
            : null;
        setSelectedTicket((prev: any) => {
          if (urlTicketId) {
            const direct = data.tickets.find((t: any) => t.id === urlTicketId);
            if (direct) return direct;
          }
          if (!prev) return data.tickets[0];
          return data.tickets.find((t: any) => t.id === prev.id) || data.tickets[0];
        });
      }
    } catch {
      // ignore poll error
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages?.length]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;

    setSending(true);
    try {
      if (selectedTicket) {
        const res = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: sessionUser?.id || selectedTicket.userId,
            message: replyText,
            isAdmin: false,
            replyToSender: replyingTo?.sender,
            replyToText: replyingTo?.text,
          }),
        });
        const data = await res.json();
        setReplyText('');
        setReplyingTo(null);
        if (data.ticket) {
          setSelectedTicket(data.ticket);
          loadTickets();
        }
      } else {
        const res = await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: `شات الدعم الفني — ${sessionUser?.name || 'عميل'}`,
            message: replyText,
            priority: 'HIGH',
          }),
        });
        const data = await res.json();
        setReplyText('');
        setReplyingTo(null);
        if (data.ticket) {
          setSelectedTicket(data.ticket);
          loadTickets();
        }
      }
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedTicket) return;
    const res = await fetch(
      `/api/tickets/${selectedTicket.id}/messages?messageId=${messageId}`,
      { method: 'DELETE' }
    );
    const data = await res.json();
    if (data.ticket) {
      setSelectedTicket(data.ticket);
      loadTickets();
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex h-[75vh] min-h-[520px] flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
        {/* Top Chat Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-primary)] px-5 py-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] text-black shadow-[0_0_16px_rgba(204,255,0,0.35)]">
              <Headphones className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-primary)] bg-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">
                  {isAr
                    ? 'شات الدعم الفني المباشر — GIGADROP'
                    : 'GIGADROP Live Technical Support Chat'}
                </h1>
                <span className="rounded-full bg-[#CCFF00]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#CCFF00]">
                  {isAr ? 'متصل الآن' : 'Online'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {isAr
                  ? 'تواصل مباشر وفوري مع الأدمن بدون نماذج'
                  : 'Direct real-time chat with Admin Support'}
              </p>
            </div>
          </div>

          {tickets.length > 1 && (
            <div className="flex items-center gap-1.5">
              {tickets.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedTicket(t);
                    setReplyingTo(null);
                  }}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                    selectedTicket?.id === t.id
                      ? 'border-[#CCFF00] bg-[#CCFF00] text-black'
                      : 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[#CCFF00]'
                  }`}
                >
                  {isAr ? `محادثة #${idx + 1}` : `Chat #${idx + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 space-y-3.5 overflow-y-auto p-5">
          {selectedTicket?.messages?.length ? (
            selectedTicket.messages.map((m: any) => {
              const parsed = parseQuotedMessage(m.message || '');
              const isSupport = Boolean(m.isAdmin);
              const senderLabel = isSupport
                ? isAr
                  ? 'الأدمن / الدعم الفني'
                  : 'Admin / Support'
                : sessionUser?.name || (isAr ? 'أنت' : 'You');

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    isSupport ? 'items-start' : 'items-end'
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-[16px] p-3.5 text-xs shadow-sm transition-all ${
                      isSupport
                        ? 'rounded-ts-none border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)]'
                        : 'rounded-te-none border border-[#CCFF00]/50 bg-[#CCFF00]/15 text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-4 border-b border-[var(--border)]/60 pb-1">
                      <span
                        className={`text-[11px] font-extrabold ${
                          isSupport ? 'text-[#CCFF00]' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {senderLabel}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setReplyingTo({
                              id: m.id,
                              sender: senderLabel,
                              text: parsed.body,
                            })
                          }
                          className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-secondary)] hover:border-[#CCFF00] hover:text-[#CCFF00]"
                        >
                          <Reply className="h-3 w-3" />
                          {isAr ? 'رد' : 'Reply'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(m.id)}
                          className="inline-flex items-center gap-1 rounded border border-transparent px-1.5 py-0.5 text-[10px] font-bold text-[var(--text-muted)] hover:border-[#FF4444]/40 hover:bg-[#FF4444]/10 hover:text-[#FF4444]"
                        >
                          <Trash2 className="h-3 w-3" />
                          {isAr ? 'مسح' : 'Delete'}
                        </button>
                      </div>
                    </div>

                    {parsed.quoteText && (
                      <div className="my-2 rounded-[8px] border-s-2 border-[#CCFF00] bg-black/25 px-3 py-1.5 text-[11px] text-[var(--text-secondary)]">
                        <span className="block font-bold text-[#CCFF00]">
                          {isAr
                            ? `رداً على ${parsed.quoteSender}:`
                            : `Replying to ${parsed.quoteSender}:`}
                        </span>
                        <p className="line-clamp-2 italic">{parsed.quoteText}</p>
                      </div>
                    )}

                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {parsed.body}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-[var(--text-secondary)]">
              <MessageSquare className="mb-2 h-8 w-8 text-[#CCFF00]" />
              <p>
                {isAr
                  ? 'ابدأ المحادثة الآن بكتابة رسالتك بالأسفل وسيرد عليك الأدمن فوراً.'
                  : 'Start chatting below and our Admin team will reply immediately.'}
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Chat Input */}
        <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] p-4">
          {replyingTo && (
            <div className="mb-2.5 flex items-center justify-between rounded-[10px] border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3.5 py-2 text-xs">
              <div className="overflow-hidden">
                <span className="font-bold text-[#CCFF00]">
                  {isAr
                    ? `الرد على رسالة (${replyingTo.sender}): `
                    : `Replying to (${replyingTo.sender}): `}
                </span>
                <span className="line-clamp-1 text-[var(--text-secondary)]">
                  {replyingTo.text}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="ms-2 rounded p-1 text-[var(--text-secondary)] hover:text-[#FF4444]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSendReply} className="flex items-center gap-2.5">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب رسالتك للدعم الفني هنا...'
                  : 'Type your message to support here...'
              }
              className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[#CCFF00]"
            />
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#CCFF00] px-6 text-xs sm:text-sm font-extrabold text-black shadow-md transition-all hover:bg-[#B8E600] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isAr ? 'إرسال' : 'Send'}</span>
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)] px-2">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#CCFF00]" />
              {isAr
                ? 'يمكنك الضغط على «رد» على أي رسالة للاقتباس أو «مسح» لحذفها.'
                : 'Click "Reply" on any message to quote it or "Delete" to remove it.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
