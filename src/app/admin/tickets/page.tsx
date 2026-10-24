'use client';

import React, { useEffect, useRef, useState } from 'react';
import WhatsAppChatView from '@/components/chat/WhatsAppChatView';
import { useThemeStore } from '@/stores/themeStore';
import {
  MessageSquare,
  Search,
  CheckCheck,
  Check,
  Phone,
  ExternalLink,
  Trash2,
  HardDrive,
  User,
  Filter,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function AdminTicketsPage() {
  const { locale, theme } = useThemeStore();
  const isAr = locale === 'ar';
  const isDark = theme !== 'light';

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'ORDERS'>('ALL');
  const [loading, setLoading] = useState(true);

  const selectedIdRef = useRef<string | null>(null);

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        setSelectedTicket((prev: any) => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSelectTicket = (t: any) => {
    selectedIdRef.current = t.id;
    setSelectedTicket(t);

    // When admin opens the ticket, immediately mark messages as read
    fetch(`/api/tickets/${t.id}/messages`).catch(() => {});
  };

  const handleSendMessage = async (text: string, mediaUrl?: string, replyTo?: any) => {
    if (!selectedTicket) return;

    const res = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        mediaUrl,
        isAdmin: true,
        status: 'IN_PROGRESS',
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

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;
    const confirmDelete = window.confirm(
      isAr
        ? 'هل أنت متأكد من مسح هذه المحادثة بالكامل؟'
        : 'Are you sure you want to delete this entire chat conversation?'
    );
    if (!confirmDelete) return;

    await fetch(`/api/tickets/${selectedTicket.id}/messages`, { method: 'DELETE' });
    const remaining = tickets.filter((t) => t.id !== selectedTicket.id);
    setTickets(remaining);
    const next = remaining[0] || null;
    selectedIdRef.current = next?.id || null;
    setSelectedTicket(next);
  };

  // Filter conversations
  const filteredTickets = tickets.filter((t) => {
    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const customerName = (t.user?.name || '').toLowerCase();
      const customerEmail = (t.user?.email || '').toLowerCase();
      const customerPhone = (t.user?.phone || t.user?.whatsapp || '').toLowerCase();
      const lastMsg = (t.messages?.[t.messages.length - 1]?.message || '').toLowerCase();
      const orderNumber = (t.order?.orderNumber || '').toLowerCase();

      const matchesSearch =
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        customerPhone.includes(q) ||
        lastMsg.includes(q) ||
        orderNumber.includes(q);

      if (!matchesSearch) return false;
    }

    // 2. Tab filter
    if (activeFilter === 'UNREAD') {
      return (t.unreadCount || 0) > 0;
    }
    if (activeFilter === 'ORDERS') {
      return Boolean(t.orderId || t.order);
    }
    return true;
  });

  const totalUnread = tickets.reduce((acc, t) => acc + (t.unreadCount || 0), 0);

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {isAr ? 'نظام محادثات واتساب المباشر' : 'WHATSAPP LIVE CHAT SYSTEM'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            {isAr ? 'شات العملاء والدعم الفني' : 'Customer WhatsApp Support'}
            {totalUnread > 0 && (
              <span className="ms-2.5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-extrabold text-white animate-pulse">
                {totalUnread} {isAr ? 'غير مقروءة' : 'unread'}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Main 2-Column WhatsApp Web Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[78vh] min-h-[600px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
        {/* ----------------------------------------------------------- */}
        {/* LEFT COLUMN: WHATSAPP WEB CONVERSATIONS SIDEBAR             */}
        {/* ----------------------------------------------------------- */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col border-e border-[var(--border)] bg-[var(--bg-primary)] overflow-hidden">
          {/* WhatsApp Sidebar Header */}
          <div className="border-b border-[var(--border)] p-3.5 flex items-center justify-between gap-2 bg-[var(--bg-card)]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white shadow-sm">
                💬
              </span>
              <div>
                <p className="text-xs font-black text-[var(--text-primary)]">
                  {isAr ? 'محادثات العملاء' : 'Customer Chats'}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {tickets.length} {isAr ? 'محادثة نشطة' : 'active threads'}
                </p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-primary)]">
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-1.5 text-xs">
              <Search className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث بالاسم، الهاتف، أو الرسالة...' : 'Search customer, phone, message...'}
                className="w-full bg-transparent text-xs text-[var(--text-primary)] outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                  activeFilter === 'ALL'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-emerald-500'
                }`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('UNREAD')}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                  activeFilter === 'UNREAD'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-emerald-500'
                }`}
              >
                {isAr ? 'غير مقروءة' : 'Unread'}
                {totalUnread > 0 && ` (${totalUnread})`}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('ORDERS')}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                  activeFilter === 'ORDERS'
                    ? 'bg-emerald-600 text-white'
                    : 'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-emerald-500'
                }`}
              >
                {isAr ? 'طلبات هاردات 📦' : 'Orders 📦'}
              </button>
            </div>
          </div>

          {/* Conversations Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
            {filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-[var(--text-secondary)]">
                <MessageSquare className="mb-2 h-8 w-8 text-emerald-500 opacity-60" />
                <p className="font-bold">
                  {isAr ? 'لا توجد محادثات تطابق البحث' : 'No conversations match search'}
                </p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const customerName = t.user?.name || (isAr ? 'عميل GigaDrop' : 'Customer');
                const customerPhone = t.user?.phone || t.user?.whatsapp || '';
                const lastMsgObj = t.messages?.[t.messages.length - 1];
                const lastMsg = lastMsgObj?.message?.replace(/^\[\[QUOTE:[^|]+\|[\s\S]*?\]\]\n/, '') || '';
                const isSelected = selectedTicket?.id === t.id;
                const unreadCount = t.unreadCount || 0;

                const lastMsgTime = lastMsgObj
                  ? new Date(lastMsgObj.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                const waPhone = customerPhone.replace(/[^0-9]/g, '');

                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    className={`group relative flex items-start gap-3 p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-s-4 border-emerald-600'
                        : 'hover:bg-[var(--bg-card)]'
                    }`}
                  >
                    {/* Customer Avatar Circle with Green Status Dot */}
                    <div className="relative shrink-0">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white shadow-sm">
                        {customerName.charAt(0).toUpperCase()}
                      </span>
                      <span
                        className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg-primary)] bg-emerald-400"
                        title={isAr ? 'متصل' : 'Online'}
                      />
                    </div>

                    {/* Customer Info & Message Preview */}
                    <div className="flex-1 min-w-0">
                      {/* Line 1: Name + Time */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-black text-[var(--text-primary)]" dir="auto">
                          {customerName}
                        </p>
                        <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                          {lastMsgTime}
                        </span>
                      </div>

                      {/* Line 2: Message preview snippet + unread badge */}
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-[11px] text-[var(--text-secondary)]" dir="auto">
                          {lastMsgObj?.isAdmin && (
                            <span className="inline-flex items-center me-1">
                              {lastMsgObj.isRead ? (
                                <CheckCheck className="h-3 w-3 text-[#53bdeb] inline" />
                              ) : (
                                <CheckCheck className="h-3 w-3 text-zinc-400 inline" />
                              )}
                            </span>
                          )}
                          {lastMsgObj?.mediaUrl ? (isAr ? '📷 [صورة مرفقة]' : '📷 [Photo]') : lastMsg || (isAr ? 'بدء محادثة...' : 'New chat...')}
                        </p>

                        {unreadCount > 0 && (
                          <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-black text-white">
                            {unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Line 3: Phone number & Order Tag */}
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                        {customerPhone && (
                          <span className="font-mono" dir="ltr">
                            {customerPhone}
                          </span>
                        )}
                        {t.order?.orderNumber && (
                          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {t.order.orderNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick WhatsApp External Link (Hover Button) */}
                    {waPhone && (
                      <a
                        href={`https://wa.me/${waPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={isAr ? 'فتح واتساب العميل مباشرة' : 'Open customer WhatsApp'}
                        className="hidden group-hover:flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shrink-0"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* RIGHT COLUMN: WHATSAPP ACTIVE CHAT THREAD                   */}
        {/* ----------------------------------------------------------- */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col h-full overflow-hidden">
          {selectedTicket ? (
            <WhatsAppChatView
              ticket={selectedTicket}
              isAdminView={true}
              onSendMessage={handleSendMessage}
              onDeleteMessage={handleDeleteMessage}
              onDeleteTicket={handleDeleteTicket}
              customerWhatsappNumber={selectedTicket.user?.whatsapp || selectedTicket.user?.phone}
              customerName={selectedTicket.user?.name}
              customerOrder={selectedTicket.order}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[var(--text-secondary)]">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600 mb-3">
                <MessageSquare className="h-8 w-8" />
              </span>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                {isAr ? 'نظام محادثات واتساب ويب لخدمة عملاء GigaDrop' : 'GigaDrop WhatsApp Web Customer Support'}
              </h2>
              <p className="mt-1 max-w-sm text-xs text-[var(--text-muted)]">
                {isAr
                  ? 'اختر أي محادثة عميل من القائمة الجانبية لبدء المحادثة، إرسال سكرين شوت وصور الهارد، وإرسال الردود السريعة.'
                  : 'Select any customer conversation from the sidebar to chat, send screenshots, and dispatch quick replies.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
