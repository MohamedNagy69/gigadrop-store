'use client';

import React, { useEffect, useState } from 'react';
import { Paper, Typography, Chip } from '@mui/material';
import { Send, Reply, Trash2, X } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

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

export default function AdminTicketsPage() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [reply, setReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    sender: string;
    text: string;
  } | null>(null);

  const loadTickets = async () => {
    const res = await fetch('/api/tickets');
    const data = await res.json();
    if (data.tickets) {
      setTickets(data.tickets);
      if (!selected && data.tickets.length > 0) {
        setSelected(data.tickets[0]);
      } else if (selected) {
        const updated = data.tickets.find((t: any) => t.id === selected.id);
        setSelected(updated || data.tickets[0] || null);
      }
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !reply.trim()) return;
    const res = await fetch(`/api/tickets/${selected.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'admin',
        message: reply,
        isAdmin: true,
        status: 'IN_PROGRESS',
        replyToSender: replyingTo?.sender,
        replyToText: replyingTo?.text,
      }),
    });
    const data = await res.json();
    setReply('');
    setReplyingTo(null);
    if (data.ticket) {
      setSelected(data.ticket);
      loadTickets();
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selected) return;
    const res = await fetch(
      `/api/tickets/${selected.id}/messages?messageId=${messageId}`,
      { method: 'DELETE' }
    );
    const data = await res.json();
    if (data.ticket) {
      setSelected(data.ticket);
      loadTickets();
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    await fetch(`/api/tickets/${ticketId}/messages`, { method: 'DELETE' });
    setReplyingTo(null);
    const remaining = tickets.filter((t) => t.id !== ticketId);
    setTickets(remaining);
    setSelected(remaining[0] || null);
  };

  const handleStatusChange = async (status: string) => {
    if (!selected) return;
    await fetch(`/api/tickets/${selected.id}/messages`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setSelected({ ...selected, status });
    loadTickets();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'نظام المحادثات المباشرة مع العملاء' : 'LIVE CUSTOMER CHAT'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr
            ? `شات الدعم الفني مع العملاء (${tickets.length})`
            : `Customer Support Chats (${tickets.length})`}
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Paper sx={{ p: 3, borderRadius: 3 }} className="lg:col-span-5 space-y-2">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setSelected(t);
                setReplyingTo(null);
              }}
              className={`cursor-pointer w-full rounded-[10px] border p-3.5 text-start transition-all ${
                selected?.id === t.id
                  ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                  : 'border-[var(--border)] bg-[var(--bg-primary)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold line-clamp-1">{t.subject}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Chip
                    label={t.status}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '10px',
                      bgcolor: 'rgba(204,255,0,0.2)',
                      color: '#CCFF00',
                      fontWeight: 700,
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTicket(t.id);
                    }}
                    title={isAr ? 'حذف التذكرة' : 'Delete Ticket'}
                    className="rounded p-1 text-[var(--text-muted)] hover:bg-[#FF4444]/10 hover:text-[#FF4444]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                {isAr
                  ? `العميل: ${t.user?.name} · الأولوية: ${t.priority} · ${t.messages?.length || 0} رسائل`
                  : `Customer: ${t.user?.name} · Priority: ${t.priority} · ${t.messages?.length || 0} msgs`}
              </p>
            </div>
          ))}
        </Paper>

        <Paper
          sx={{ p: 4, borderRadius: 3 }}
          className="lg:col-span-7 flex flex-col justify-between"
        >
          {selected ? (
            <>
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <div>
                    <Typography variant="h6" fontWeight={700}>
                      {selected.subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isAr ? 'مُرسلة من: ' : 'From: '}
                      {selected.user?.name} ({selected.user?.email})
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selected.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="rounded border border-[var(--border)] bg-[var(--bg-primary)] px-2.5 py-1 text-xs font-bold text-[#CCFF00]"
                    >
                      {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDeleteTicket(selected.id)}
                      className="inline-flex items-center gap-1 rounded border border-[#FF4444]/40 bg-[#FF4444]/10 px-2.5 py-1 text-xs font-bold text-[#FF4444] hover:bg-[#FF4444] hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {isAr ? 'حذف التذكرة' : 'Delete Ticket'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pe-1">
                  {selected.messages?.map((m: any) => {
                    const parsed = parseQuotedMessage(m.message || '');
                    const senderLabel = m.isAdmin
                      ? isAr
                        ? 'الأدمن / الدعم الفني'
                        : 'Admin / Support'
                      : selected.user?.name || (isAr ? 'العميل' : 'Customer');

                    return (
                      <div
                        key={m.id}
                        className={`group rounded-[10px] p-3 text-xs transition-all ${
                          m.isAdmin
                            ? 'border border-[#CCFF00]/40 bg-[#CCFF00]/10 ms-8'
                            : 'border border-[var(--border)] bg-[var(--bg-primary)] me-8'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-[#CCFF00]">{senderLabel}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {new Date(m.createdAt).toLocaleTimeString()}
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
                              title={isAr ? 'رد على هذه الرسالة' : 'Reply to this message'}
                              className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-secondary)] hover:border-[#CCFF00] hover:text-[#CCFF00]"
                            >
                              <Reply className="h-3 w-3" />
                              {isAr ? 'رد' : 'Reply'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(m.id)}
                              title={isAr ? 'حذف الرسالة' : 'Delete message'}
                              className="inline-flex items-center gap-1 rounded border border-transparent px-1.5 py-0.5 text-[10px] font-bold text-[var(--text-muted)] hover:border-[#FF4444]/40 hover:bg-[#FF4444]/10 hover:text-[#FF4444]"
                            >
                              <Trash2 className="h-3 w-3" />
                              {isAr ? 'مسح' : 'Delete'}
                            </button>
                          </div>
                        </div>

                        {parsed.quoteText && (
                          <div className="mt-2 rounded-[6px] border-s-2 border-[#CCFF00] bg-black/20 px-2.5 py-1.5 text-[11px] text-[var(--text-secondary)]">
                            <span className="block font-bold text-[#CCFF00]">
                              {isAr ? `رداً على ${parsed.quoteSender}:` : `Replying to ${parsed.quoteSender}:`}
                            </span>
                            <p className="line-clamp-2 italic">{parsed.quoteText}</p>
                          </div>
                        )}

                        <p className="mt-1.5 leading-relaxed text-[var(--text-primary)]">
                          {parsed.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                {replyingTo && (
                  <div className="mb-2 flex items-center justify-between rounded-[8px] border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3 py-2 text-xs">
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

                <form onSubmit={handleReply} className="flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={
                      isAr
                        ? 'اكتب ردك باسم دعم GIGADROP...'
                        : 'Reply as GIGADROP Support...'
                    }
                    className="flex-1 rounded-[8px] border border-[var(--border)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#CCFF00] px-5 py-2.5 text-xs font-extrabold text-black"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isAr ? 'إرسال الرد' : 'Send Reply'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div>{isAr ? 'اختر تذكرة لعرضها' : 'Select a ticket'}</div>
          )}
        </Paper>
      </div>
    </div>
  );
}
