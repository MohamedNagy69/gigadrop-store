'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  Trash2,
  Reply,
  X,
  Phone,
  MessageSquare,
  ExternalLink,
  Volume2,
  VolumeX,
  Search,
  ShieldCheck,
  Download,
  MoreVertical,
  HardDrive,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

// Web Audio API pure synthesized WhatsApp "pop" ping (0 external dependencies)
function playWhatsAppSound() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.1); // D5 drop
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Audio context may be restricted by browser until user interaction
  }
}

export function parseQuotedMessage(raw: string) {
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

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '🎮', '📦', '🚚', '😂', '⚡', '👏', '🙏', '💯', '🕹️', '💻', '💾'];

interface WhatsAppChatViewProps {
  ticket: any;
  currentUserId?: string;
  isAdminView: boolean;
  onSendMessage: (text: string, mediaUrl?: string, replyTo?: any) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onDeleteTicket?: () => Promise<void>;
  supportWhatsappNumber?: string;
  customerWhatsappNumber?: string;
  customerName?: string;
  customerOrder?: any;
}

export default function WhatsAppChatView({
  ticket,
  currentUserId,
  isAdminView,
  onSendMessage,
  onDeleteMessage,
  onDeleteTicket,
  supportWhatsappNumber = '+201009998877',
  customerWhatsappNumber,
  customerName,
  customerOrder,
}: WhatsAppChatViewProps) {
  const { locale, theme } = useThemeStore();
  const isAr = locale === 'ar';
  const isDark = theme !== 'light';

  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; sender: string; text: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeMediaPreview, setActiveMediaPreview] = useState<string | null>(null);
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previousMessageCount = useRef<number>(ticket?.messages?.length || 0);

  // Auto scroll to bottom & sound alert on new incoming message
  useEffect(() => {
    const currentCount = ticket?.messages?.length || 0;
    if (currentCount > previousMessageCount.current) {
      const lastMsg = ticket?.messages?.[currentCount - 1];
      const isIncoming = isAdminView ? !lastMsg?.isAdmin : lastMsg?.isAdmin;
      if (isIncoming && soundEnabled) {
        playWhatsAppSound();
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    previousMessageCount.current = currentCount;
  }, [ticket?.messages?.length, isAdminView, soundEnabled]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || sending) return;

    setSending(true);
    try {
      let uploadedUrl: string | undefined = undefined;

      // Upload image attachment if selected
      if (selectedImage) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedImage.file);

        const uploadRes = await fetch('/api/chat/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedUrl = uploadData.url;
        }
        setUploadingImage(false);
      }

      await onSendMessage(inputText, uploadedUrl, replyingTo);
      setInputText('');
      setSelectedImage(null);
      setReplyingTo(null);
      setShowEmojiPicker(false);
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert(isAr ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' : 'Image size must be less than 5MB');
      return;
    }

    const preview = URL.createObjectURL(file);
    setSelectedImage({ file, preview });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleQuickChip = (text: string) => {
    setInputText((prev) => (prev ? `${prev} ${text}` : text));
  };

  // WhatsApp quick response templates
  const adminQuickChips = [
    isAr ? '🚚 طلبك قيد التجهيز وسيتم تسليمه للمندوب اليوم' : '🚚 Your order is being prepared and will be dispatched today',
    isAr ? '🎮 تم الانتهاء من تحميل كافة الألعاب بنجاح!' : '🎮 All requested games have been successfully loaded!',
    isAr ? '💳 يرجى تأكيد إشعار تحويل إنستاباي أو فودافون كاش' : '💳 Please confirm your InstaPay or Vodafone Cash transfer',
    isAr ? '📦 تم تسليم الهارد لشركة الشحن' : '📦 Drive handed over to courier',
    isAr ? '🔌 تأكد من توصيل الهارد بمنفذ USB 3.0 الأزرق للسرعة القصوى' : '🔌 Ensure connecting to a blue USB 3.0 port for peak speed',
  ];

  const customerQuickChips = [
    isAr ? '❓ أين وصل طلبي وموعد التسليم؟' : '❓ What is the status of my order and delivery time?',
    isAr ? '📸 تم تحويل المبلغ عبر إنستاباي، سأرسل إشعار الدفع' : '📸 Payment made via InstaPay, sending receipt',
    isAr ? '🎮 هل يمكن إضافة ألعاب إضافية للهارد؟' : '🎮 Can I add more games to the drive?',
    isAr ? '📍 تأكيد العنوان وميعاد تواجدي' : '📍 Confirming my delivery address & time',
  ];

  const quickChips = isAdminView ? adminQuickChips : customerQuickChips;

  // Contact Info for WhatsApp External Link
  const targetWhatsapp = isAdminView
    ? customerWhatsappNumber?.replace(/[^0-9]/g, '') || ticket?.user?.whatsapp?.replace(/[^0-9]/g, '') || ticket?.user?.phone?.replace(/[^0-9]/g, '')
    : supportWhatsappNumber?.replace(/[^0-9]/g, '');

  const waLink = targetWhatsapp
    ? `https://wa.me/${targetWhatsapp}?text=${encodeURIComponent(
        isAr
          ? `مرحباً، بخصوص طلب ألعاب GigaDrop${ticket?.order?.orderNumber ? ` رقم ${ticket.order.orderNumber}` : ''}`
          : `Hello, regarding GigaDrop Order${ticket?.order?.orderNumber ? ` ${ticket.order.orderNumber}` : ''}`
      )}`
    : null;

  const displayName = isAdminView
    ? ticket?.user?.name || customerName || (isAr ? 'عميل GigaDrop' : 'GigaDrop Customer')
    : isAr
    ? 'الدعم الفني المباشر — أحمد ستور (GigaDrop)'
    : 'GigaDrop Live Support — Ahmed Store';

  // Filter messages if search is active
  const filteredMessages = ticket?.messages?.filter((m: any) => {
    if (!searchQuery.trim()) return true;
    const body = parseQuotedMessage(m.message || '').body.toLowerCase();
    return body.includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
      {/* ------------------------------------------------------------- */}
      {/* 1. WHATSAPP TOP HEADER BAR                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-primary)] px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Avatar with WhatsApp Online Badge */}
          <div className="relative">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <span
              className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-primary)] bg-emerald-400"
              title={isAr ? 'متصل الآن' : 'Online'}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)]" dir="auto">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                <span>{isAr ? 'موثوق' : 'Verified'}</span>
              </span>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>{isAr ? 'متصل الآن (Online)' : 'Online now'}</span>
              {ticket?.order?.orderNumber && (
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  • {ticket.order.orderNumber}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Top Controls: Search, Sound Mute, WhatsApp Redirect, Order Drawer */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search in messages toggle */}
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            title={isAr ? 'بحث في الرسائل' : 'Search in messages'}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
              showSearch
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? (isAr ? 'كتم صوت الإشعارات' : 'Mute notification sound') : (isAr ? 'تفعيل صوت الإشعارات' : 'Unmute notification sound')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <VolumeX className="h-4 w-4 text-[var(--text-muted)]" />
            )}
          </button>

          {/* Direct WhatsApp External Button */}
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              title={isAr ? 'فتح المحادثة في تطبيق واتساب' : 'Open in WhatsApp App'}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-600/10 hover:bg-emerald-600 hover:text-white px-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-all shadow-sm"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isAr ? 'فتح في واتساب' : 'Open WhatsApp'}</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          )}

          {/* Customer Order Details Button (if order exists) */}
          {ticket?.order && (
            <button
              type="button"
              onClick={() => setShowOrderDrawer(!showOrderDrawer)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 text-xs font-bold text-[var(--text-primary)] hover:border-emerald-500 transition-all"
            >
              <HardDrive className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden sm:inline">{isAr ? 'بيانات الطلب' : 'Order Info'}</span>
            </button>
          )}

          {/* Delete Ticket (Admin Only) */}
          {isAdminView && onDeleteTicket && (
            <button
              type="button"
              onClick={onDeleteTicket}
              title={isAr ? 'مسح المحادثة بالكامل' : 'Delete entire chat'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input Bar (collapsible) */}
      {showSearch && (
        <div className="border-b border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 flex items-center gap-2">
          <Search className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن نص في رسائل المحادثة...' : 'Search message text...'}
            className="flex-1 bg-transparent text-xs text-[var(--text-primary)] outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {isAr ? 'مسح' : 'Clear'}
            </button>
          )}
        </div>
      )}

      {/* Customer Order Quick Info Card (Collapsible) */}
      {showOrderDrawer && ticket?.order && (
        <div className="border-b border-[var(--border)] bg-emerald-500/5 px-5 py-3 text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-600 font-black">
              📦
            </span>
            <div>
              <p className="font-extrabold text-[var(--text-primary)]">
                {isAr ? 'طلب رقم: ' : 'Order: '}
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {ticket.order.orderNumber}
                </span>
                {' • '}
                <span className="uppercase text-[11px] font-bold text-[var(--text-secondary)]">
                  {ticket.order.status}
                </span>
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {ticket.order.totalGB} GB • {ticket.order.totalPrice} {isAr ? 'ج.م' : 'EGP'} • {ticket.order.address}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowOrderDrawer(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-bold"
          >
            ✕ {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CHAT MESSAGES STREAM (WHATSAPP WALLPAPER & BUBBLES)         */}
      {/* ------------------------------------------------------------- */}
      <div
        className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6"
        style={{
          backgroundColor: isDark ? '#0b141a' : '#efeae2',
          backgroundImage: isDark
            ? 'radial-gradient(#1f2c34 0.75px, transparent 0.75px)'
            : 'radial-gradient(#d1d7db 0.85px, transparent 0.85px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Date / Security Notice Pill */}
        <div className="flex justify-center my-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#182229]/90 px-3.5 py-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>{isAr ? 'محادثة مشفرة ومباشرة مع إدارة GigaDrop' : 'Encrypted direct chat with GigaDrop Support'}</span>
          </span>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center text-xs text-zinc-500">
            <MessageSquare className="mb-2 h-10 w-10 text-emerald-500 opacity-60" />
            <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300">
              {isAr ? 'لا توجد رسائل بعد' : 'No messages yet'}
            </p>
            <p className="mt-1 max-w-xs text-zinc-500 dark:text-zinc-400">
              {isAr
                ? 'اكتب رسالتك بالأسفل للتواصل المباشر مع أحمد ستور / فريق الدعم الفني'
                : 'Type your message below to start chatting with Ahmed Store / GigaDrop Support'}
            </p>
          </div>
        ) : (
          filteredMessages.map((m: any) => {
            const parsed = parseQuotedMessage(m.message || '');
            const isAdminMsg = Boolean(m.isAdmin);

            // Determine if this bubble belongs to "Me" or "The other person"
            const isOutgoing = isAdminView ? isAdminMsg : !isAdminMsg;
            const senderName = isAdminMsg
              ? isAr ? 'الدعم الفني / أحمد' : 'Ahmed Store / Support'
              : ticket?.user?.name || (isAr ? 'أنت' : 'You');

            const messageTime = new Date(m.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={m.id}
                className={`flex flex-col group ${isOutgoing ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative max-w-[88%] sm:max-w-[72%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md transition-all ${
                    isOutgoing
                      ? isDark
                        ? 'rounded-te-xs bg-[#005c4b] text-[#e9edef]'
                        : 'rounded-te-xs bg-[#d9fdd3] text-[#111b21]'
                      : isDark
                      ? 'rounded-ts-xs bg-[#202c33] text-[#e9edef]'
                      : 'rounded-ts-xs bg-[#ffffff] text-[#111b21]'
                  }`}
                >
                  {/* Sender Name in Group/Admin context */}
                  {!isOutgoing && (
                    <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-black">
                      <span className={isAdminMsg ? 'text-emerald-500 font-bold' : 'text-cyan-500 font-bold'}>
                        {senderName}
                      </span>
                    </div>
                  )}

                  {/* Quoted Message Preview Box (if replying) */}
                  {parsed.quoteText && (
                    <div
                      className={`my-1.5 rounded-lg border-s-4 px-2.5 py-1 text-[11px] ${
                        isOutgoing
                          ? 'border-emerald-300 bg-black/20 text-white/90'
                          : 'border-emerald-500 bg-black/5 dark:bg-black/30 text-[var(--text-secondary)]'
                      }`}
                    >
                      <span className="block font-bold text-emerald-400">
                        {parsed.quoteSender}:
                      </span>
                      <p className="line-clamp-2 italic">{parsed.quoteText}</p>
                    </div>
                  )}

                  {/* Media Attachment (Photo / Screenshot) */}
                  {m.mediaUrl && (
                    <div className="my-1.5 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                      <img
                        src={m.mediaUrl}
                        alt="attachment"
                        onClick={() => setActiveMediaPreview(m.mediaUrl)}
                        className="max-h-64 w-full cursor-pointer object-cover transition-transform hover:scale-102"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Text Message Content */}
                  {parsed.body && parsed.body !== '[صورة]' && (
                    <p
                      className="text-[13px] leading-relaxed whitespace-pre-wrap break-words"
                      dir="auto"
                    >
                      {parsed.body}
                    </p>
                  )}

                  {/* Bottom Metadata: Timestamp + WhatsApp Ticks */}
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-75">
                    <span>{messageTime}</span>

                    {/* WhatsApp Checkmarks for Outgoing Messages */}
                    {isOutgoing && (
                      <span
                        className="inline-flex items-center"
                        title={m.isRead ? (isAr ? 'تمت القراءة' : 'Read') : (isAr ? 'تم الاستلام' : 'Delivered')}
                      >
                        {m.isRead ? (
                          <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                        ) : (
                          <CheckCheck className="h-3.5 w-3.5 text-zinc-400" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Hover Action Menu (Reply & Delete) */}
                  <div className="absolute top-1 end-1 hidden group-hover:flex items-center gap-1 rounded-md bg-black/40 px-1 py-0.5 backdrop-blur-sm text-[10px] text-white">
                    <button
                      type="button"
                      onClick={() =>
                        setReplyingTo({
                          id: m.id,
                          sender: senderName,
                          text: parsed.body,
                        })
                      }
                      title={isAr ? 'رد' : 'Reply'}
                      className="hover:text-emerald-400 p-0.5"
                    >
                      <Reply className="h-3 w-3" />
                    </button>
                    {onDeleteMessage && (
                      <button
                        type="button"
                        onClick={() => onDeleteMessage(m.id)}
                        title={isAr ? 'مسح' : 'Delete'}
                        className="hover:text-red-400 p-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. QUICK RESPONSE ACTION CHIPS                                */}
      {/* ------------------------------------------------------------- */}
      <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] shrink-0 px-1">
          {isAr ? 'ردود سريعة:' : 'Quick:'}
        </span>
        {quickChips.map((chip, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleQuickChip(chip)}
            className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-bold text-[var(--text-secondary)] hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:scale-102"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. REPLIED MESSAGE PREVIEW & IMAGE ATTACHMENT PREVIEW          */}
      {/* ------------------------------------------------------------- */}
      {replyingTo && (
        <div className="border-t border-[var(--border)] bg-emerald-500/10 px-4 py-2 flex items-center justify-between text-xs animate-fadeIn">
          <div className="overflow-hidden">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {isAr ? `الرد على (${replyingTo.sender}): ` : `Replying to (${replyingTo.sender}): `}
            </span>
            <span className="line-clamp-1 text-[var(--text-secondary)]">
              {replyingTo.text}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setReplyingTo(null)}
            className="text-[var(--text-muted)] hover:text-red-500 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] p-3 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <img
              src={selectedImage.preview}
              alt="attachment preview"
              className="h-14 w-14 rounded-lg object-cover border border-emerald-500 shadow-sm"
            />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">
                {selectedImage.file.name}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold">
                {isAr ? 'جاهز للإرسال كصورة في المحادثة' : 'Ready to send as photo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="rounded-full bg-red-500/15 p-1.5 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Emoji Quick Bar Popup */}
      {showEmojiPicker && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-card)] p-2.5 flex flex-wrap gap-2 animate-fadeIn">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setInputText((prev) => prev + emoji);
              }}
              className="text-lg hover:scale-125 transition-transform p-1 rounded hover:bg-[var(--bg-primary)]"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. WHATSAPP BOTTOM INPUT BAR                                  */}
      {/* ------------------------------------------------------------- */}
      <form
        onSubmit={handleSend}
        className="border-t border-[var(--border)] bg-[var(--bg-primary)] p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
      >
        {/* Hidden file input for images */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title={isAr ? 'إرفاق صورة أو سكرين شوت' : 'Attach photo or screenshot'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-emerald-500 hover:border-emerald-500 transition-all"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title={isAr ? 'إيموجي' : 'Emoji'}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
            showEmojiPicker
              ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Smile className="h-4 w-4" />
        </button>

        {/* Main Text Input Field */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isAr
              ? 'اكتب رسالتك هنا... (أو اضغط Enter للإرسال)'
              : 'Type a message... (Press Enter to send)'
          }
          className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-emerald-500 transition-colors shadow-inner"
        />

        {/* WhatsApp Signature Send Button */}
        <button
          type="submit"
          disabled={(!inputText.trim() && !selectedImage) || sending || uploadingImage}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-500 active:scale-95 disabled:opacity-40 transition-all"
          title={isAr ? 'إرسال' : 'Send'}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* ------------------------------------------------------------- */}
      {/* 6. IMAGE LIGHTBOX MODAL                                       */}
      {/* ------------------------------------------------------------- */}
      {activeMediaPreview && (
        <div
          onClick={() => setActiveMediaPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={activeMediaPreview}
              alt="expanded media"
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <div className="absolute top-3 end-3 flex items-center gap-2">
              <a
                href={activeMediaPreview}
                download
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                title={isAr ? 'تحميل الصورة' : 'Download'}
              >
                <Download className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setActiveMediaPreview(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
