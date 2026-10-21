'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { Send, Reply, Trash2, X, MessageSquare, User } from 'lucide-react';
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
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    sender: string;
    text: string;
  } | null>(null);

  const selectedIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        setSelected((prev: any) => {
          const currentId = selectedIdRef.current || prev?.id;
          if (currentId) {
            const found = data.tickets.find((t: any) => t.id === currentId);
            if (found) return found;
          }
          const first = data.tickets[0] || null;
          selectedIdRef.current = first?.id || null;
          return first;
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
  }, [selected?.messages?.length]);

  const handleSelectTicket = (t: any) => {
    selectedIdRef.current = t.id;
    setSelected(t);
    setReplyingTo(null);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !reply.trim() || sending) return;
    setSending(true);
    try {
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
    } finally {
      setSending(false);
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
    const next = remaining[0] || null;
    selectedIdRef.current = next?.id || null;
    setSelected(next);
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
        {/* Sidebar: Customer Conversations List */}
        <Paper
          sx={{ p: 3, borderRadius: 3 }}
          className="lg:col-span-4 space-y-2.5 max-h-[72vh] overflow-y-auto"
        >
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center text-xs text-[var(--text-secondary)]">
              <MessageSquare className="mb-2 h-8 w-8 text-[#CCFF00]" />
              <p>
                {isAr
                  ? 'لا توجد محادثات نشطة حالياً. ستظهر محادثة العميل هنا فور إرساله رسالة من صفحة الدعم الفني.'
                  : 'No active customer chats yet. Conversations appear here when a customer messages support.'}
              </p>
            </div>
          ) : (
            tickets.map((t) => {
              const customerName = t.user?.name || (isAr ? 'عميل' : 'Customer');
              const customerEmail = t.user?.email || '';
              const lastMsgRaw =
                t.messages?.[t.messages.length - 1]?.message || '';
              const lastMsg = parseQuotedMessage(lastMsgRaw).body;
              const msgsCount = t.messages?.length || 0;
              const isSelected = selected?.id === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTicket(t)}
                  className={`cursor-pointer w-full rounded-[12px] border p-3.5 text-start transition-all ${
                    isSelected
                      ? 'border-[#CCFF00] bg-[#CCFF00]/10 shadow-sm'
                      : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[#CCFF00]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] text-xs font-black text-black">
                        {customerName.charAt(0).toUpperCase()}
                      </span>
                      <div className="overflow-hidden">
                        <p className="truncate text-sm font-extrabold text-[var(--text-primary)]" dir="auto">
                          {customerName}
                        </p>
                        {customerEmail && (
                          <p
                            className="truncate text-[11px] text-[var(--text-secondary)]"
                            dir="ltr"
                          >
                            {customerEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="rounded-full bg-[#CCFF00]/15 px-2 py-0.5 text-[10px] font-bold text-[#CCFF00]">
                        {msgsCount} {isAr ? 'رسائل' : 'msgs'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTicket(t.id);
                        }}
                        title={isAr ? 'مسح المحادثة' : 'Delete Chat'}
                        className="rounded p-1 text-[var(--text-muted)] hover:bg-[#FF4444]/10 hover:text-[#FF4444]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {lastMsg && (
                    <p
                      className="mt-2 line-clamp-1 text-xs text-[var(--text-secondary)]"
                      dir="auto"
                    >
                      {lastMsg}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </Paper>

        {/* Main Chat Thread Window */}
        <Paper
          sx={{ p: 0, borderRadius: 3 }}
          className="lg:col-span-8 flex h-[72vh] min-h-[480px] flex-col justify-between overflow-hidden"
        >
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-primary)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] text-sm font-black text-black">
                    {(selected.user?.name || 'C').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-base font-extrabold text-[var(--text-primary)]" dir="auto">
                      {selected.user?.name || (isAr ? 'عميل' : 'Customer')}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]" dir="ltr">
                      {selected.user?.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTicket(selected.id)}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#FF4444]/40 bg-[#FF4444]/10 px-3 py-1.5 text-xs font-bold text-[#FF4444] hover:bg-[#FF4444] hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isAr ? 'مسح المحادثة بالكامل' : 'Delete Chat'}
                </button>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 space-y-3.5 overflow-y-auto p-5">
                {selected.messages?.map((m: any) => {
                  const parsed = parseQuotedMessage(m.message || '');
                  const isAdminMsg = Boolean(m.isAdmin);
                  const senderLabel = isAdminMsg
                    ? isAr
                      ? 'الأدمن / الدعم الفني'
                      : 'Admin / Support'
                    : selected.user?.name || (isAr ? 'العميل' : 'Customer');

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        isAdminMsg ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-[14px] p-3.5 text-xs shadow-sm transition-all ${
                          isAdminMsg
                            ? 'rounded-te-none border border-[#CCFF00]/45 bg-[#CCFF00]/12'
                            : 'rounded-ts-none border border-[var(--border)] bg-[var(--bg-primary)]'
                        }`}
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-4 border-b border-[var(--border)]/60 pb-1">
                          <span
                            className={`text-[11px] font-extrabold ${
                              isAdminMsg ? 'text-[#CCFF00]' : 'text-[var(--text-primary)]'
                            }`}
                            dir="auto"
                          >
                            {senderLabel}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[var(--text-muted)]" dir="ltr">
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
                              title={isAr ? 'رد على هذه الرسالة' : 'Reply to this message'}
                              className="inline-flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-secondary)] hover:border-[#CCFF00] hover:text-[#CCFF00]"
                            >
                              <Reply className="h-3 w-3" />
                              {isAr ? 'رد' : 'Reply'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(m.id)}
                              title={isAr ? 'مسح الرسالة' : 'Delete message'}
                              className="inline-flex items-center gap-1 rounded border border-transparent px-1.5 py-0.5 text-[10px] font-bold text-[var(--text-muted)] hover:border-[#FF4444]/40 hover:bg-[#FF4444]/10 hover:text-[#FF4444]"
                            >
                              <Trash2 className="h-3 w-3" />
                              {isAr ? 'مسح' : 'Delete'}
                            </button>
                          </div>
                        </div>

                        {parsed.quoteText && (
                          <div className="my-2 rounded-[8px] border-s-2 border-[#CCFF00] bg-black/25 px-3 py-1.5 text-[11px] text-[var(--text-secondary)]">
                            <span className="block font-bold text-[#CCFF00]" dir="auto">
                              {isAr
                                ? `رداً على ${parsed.quoteSender}:`
                                : `Replying to ${parsed.quoteSender}:`}
                            </span>
                            <p className="line-clamp-2 italic" dir="auto">
                              {parsed.quoteText}
                            </p>
                          </div>
                        )}

                        <p
                          className="text-sm leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap"
                          dir="auto"
                        >
                          {parsed.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] p-4">
                {replyingTo && (
                  <div className="mb-2.5 flex items-center justify-between rounded-[8px] border border-[#CCFF00]/40 bg-[#CCFF00]/10 px-3 py-2 text-xs">
                    <div className="overflow-hidden">
                      <span className="font-bold text-[#CCFF00]" dir="auto">
                        {isAr
                          ? `الرد على رسالة (${replyingTo.sender}): `
                          : `Replying to (${replyingTo.sender}): `}
                      </span>
                      <span className="line-clamp-1 text-[var(--text-secondary)]" dir="auto">
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

                <form onSubmit={handleReply} className="flex items-center gap-2.5">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={
                      isAr
                        ? 'اكتب ردك للعميل هنا...'
                        : 'Type your reply to the customer...'
                    }
                    className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-5 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[#CCFF00]"
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#CCFF00] px-6 text-xs sm:text-sm font-extrabold text-black hover:bg-[#B8E600] disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isAr ? 'إرسال الرد' : 'Send Reply'}</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-sm text-[var(--text-secondary)]">
              <User className="mb-2 h-8 w-8 text-[#CCFF00]" />
              <p>
                {isAr
                  ? 'اختر محادثة عميل من القائمة لعرض الرسائل والرد عليها'
                  : 'Select a customer conversation to view and reply'}
              </p>
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
}
