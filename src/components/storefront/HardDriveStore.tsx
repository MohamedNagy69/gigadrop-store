'use client';

import React, { useState } from 'react';
import {
  HardDrive,
  Cpu,
  ShieldCheck,
  Zap,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  MessageSquare,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { formatNumber } from '@/lib/utils';

interface DriveProduct {
  id: string;
  name: string;
  brand: string;
  type: 'SSD' | 'HDD';
  capacityOptions: { size: string; price: number }[];
  speed: string;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
  image: string;
}

export const HARD_DRIVE_CATALOG: DriveProduct[] = [
  {
    id: 'kingston-xs1000',
    name: 'Kingston XS1000 High-Speed SSD',
    brand: 'Kingston',
    type: 'SSD',
    capacityOptions: [
      { size: '1 TB', price: 2850 },
      { size: '2 TB', price: 4750 },
    ],
    speed: '1,050 MB/s (USB 3.2 Gen 2)',
    badge: '🔥 الأكثر طلباً للجيمنج',
    badgeColor: 'border-[#CCFF00]/40 bg-[#CCFF00]/15 text-[#CCFF00]',
    description: 'هارد SSD خارجي فائق السرعة، يشغل أحدث ألعاب 2026 مباشرة بدون أي فترات تحميل أو تهنيج.',
    features: ['سرعة قراءة 1,050 ميجابايت/ثانية', 'حجم صغير جداً خفيف في الجيب', 'ضمان محلي معتمد 3 سنوات'],
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'seagate-expansion',
    name: 'Seagate Expansion Portable HDD',
    brand: 'Seagate',
    type: 'HDD',
    capacityOptions: [
      { size: '1 TB', price: 1750 },
      { size: '2 TB', price: 2450 },
      { size: '4 TB', price: 3850 },
    ],
    speed: 'USB 3.0 / 140 MB/s',
    badge: '💰 أفضل قيمة مقابل السعر',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
    description: 'الهارد الأفضل لتخزين أضخم مكتبة ألعاب (أكثر من 40 إلى 80 لعبة) بأقل تكلفة ممكنة.',
    features: ['مساحة تخزين ضخمة للألعاب', 'توصيل فوري Plug & Play بدون كهرباء خارجية', 'ضمان معتمد سنتين'],
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'wd-black-p10',
    name: 'WD Black P10 Gaming Hard Drive',
    brand: 'Western Digital',
    type: 'HDD',
    capacityOptions: [
      { size: '2 TB', price: 2950 },
      { size: '4 TB', price: 4200 },
      { size: '5 TB', price: 4950 },
    ],
    speed: 'USB 3.2 Gen 1 / 140 MB/s',
    badge: '🎮 مخصص للـ PC والكونسول',
    badgeColor: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400',
    description: 'إصدار الجيمنج الرسمي من ويسترن ديجيتال، بهيكل معدني متين ومصمم للعمل الشاق لساعات طويلة.',
    features: ['هيكل معدني قوي ومقاوم للصدمات', 'متوافق مع PC وبلايستيشن وإكس بوكس', 'ضمان ويسترن ديجيتال 3 سنوات'],
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'samsung-t7-shield',
    name: 'Samsung T7 Shield Rugged SSD',
    brand: 'Samsung',
    type: 'SSD',
    capacityOptions: [
      { size: '1 TB', price: 3400 },
      { size: '2 TB', price: 5600 },
    ],
    speed: '1,050 MB/s NVMe USB 3.2',
    badge: '⚡ مقاوم للصدمات والماء IP65',
    badgeColor: 'border-amber-500/40 bg-amber-500/15 text-amber-400',
    description: 'درع حماية مطاطي مضاد للصدمات مع معيار IP65 وسرعات NVMe فائقة للألعاب الضخمة.',
    features: ['مقاومة السقوط حتى 3 أمتار', 'حماية بكلمة مرور وتشفير أمان', 'ضمان سامسونج الرسمي 3 سنوات'],
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'wd-elements-portable',
    name: 'WD Elements Portable Hard Drive',
    brand: 'Western Digital',
    type: 'HDD',
    capacityOptions: [
      { size: '1 TB', price: 1800 },
      { size: '2 TB', price: 2500 },
    ],
    speed: 'USB 3.0 SuperSpeed',
    badge: '🛡️ الأكثر ثباتاً وموثوقية',
    badgeColor: 'border-blue-500/40 bg-blue-500/15 text-blue-400',
    description: 'الخيار الكلاسيكي الأكثر موثوقية حول العالم لتخزين الألعاب والملفات الكبيرة بأمان كامل.',
    features: ['اعتمادية فائقة بدون مشاكل', 'خفيف وسهل الحمل في أي مكان', 'ضمان استبدال معتمد سنتين'],
    image: 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'crucial-x6-portable',
    name: 'Crucial X6 Ultra-Compact SSD',
    brand: 'Crucial Micron',
    type: 'SSD',
    capacityOptions: [
      { size: '500 GB', price: 1950 },
      { size: '1 TB', price: 2900 },
    ],
    speed: '800 MB/s USB-C',
    badge: '🚀 اقتصادي وسريع جداً',
    badgeColor: 'border-purple-500/40 bg-purple-500/15 text-purple-400',
    description: 'أصغر هارد SSD وزناً وأداءً ممتازاً مقارنة بالسعر، لنقل الألعاب وتشغيلها مباشرة.',
    features: ['وزن خفيف أقل من 40 جرام', 'سرعة قراءة 800 ميجابايت/ثانية', 'ضمان مايكرون معتمد 3 سنوات'],
    image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=600&auto=format&fit=crop&q=80',
  },
];

export default function HardDriveStore() {
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';
  const { setCheckoutOpen } = useCartStore();

  const [selectedType, setSelectedType] = useState<'ALL' | 'SSD' | 'HDD'>('ALL');
  const [selectedCapacities, setSelectedCapacities] = useState<Record<string, number>>({
    'kingston-xs1000': 0,
    'seagate-expansion': 0,
    'wd-black-p10': 0,
    'samsung-t7-shield': 0,
    'wd-elements-portable': 0,
    'crucial-x6-portable': 0,
  });

  const filteredDrives = HARD_DRIVE_CATALOG.filter((d) => {
    if (selectedType === 'ALL') return true;
    return d.type === selectedType;
  });

  const handleSelectCapacity = (driveId: string, index: number) => {
    setSelectedCapacities((prev) => ({ ...prev, [driveId]: index }));
  };

  const handleOrderDrive = (drive: DriveProduct) => {
    const capIndex = selectedCapacities[drive.id] || 0;
    const chosenCap = drive.capacityOptions[capIndex];
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'gigadrop_selected_drive',
        JSON.stringify({
          driveName: drive.name,
          capacity: chosenCap.size,
          price: chosenCap.price,
        })
      );
    }
    setCheckoutOpen(true);
  };

  return (
    <section id="hard-drives" className="relative py-20 border-t border-[var(--border)] overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[750px] rounded-full bg-[#CCFF00]/[0.05] blur-[150px] -z-10"
      />

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#CCFF00] mb-3">
              <HardDrive className="h-3.5 w-3.5" />
              <span>{isAr ? 'متجر الهارد ديسك الجديد • HARD DRIVE STORE' : 'HARD DRIVE STORE • NEW CERTIFIED DRIVES'}</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
              {isAr ? 'اختر هاردك الجديد مع ألعابك' : 'Buy a New Drive Loaded with Games'}
            </h2>
            
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              {isAr
                ? 'لا تملك هارد ديسك كافي؟ نوفر لك أحدث الهاردات الأصلية المضمونة بنسبة 100% (SSD سريعة جداً و HDD بمساحات عملاقة) مع ضمان محلي معتمد، ونحمل ألعابك عليها ونسلمك إياها جاهزة للعب!'
                : 'Don’t have a drive? Get brand-new verified drives (fast SSDs and spacious HDDs) with official warranty, preloaded with all your favorite games ready to plug & play!'}
            </p>
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5 self-start md:self-end">
            <button
              type="button"
              onClick={() => setSelectedType('ALL')}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                selectedType === 'ALL'
                  ? 'bg-[#CCFF00] text-black shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('SSD')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                selectedType === 'SSD'
                  ? 'bg-[#CCFF00] text-black shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>SSD (فائق السرعة)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('HDD')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                selectedType === 'HDD'
                  ? 'bg-[#CCFF00] text-black shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <HardDrive className="h-3.5 w-3.5" />
              <span>HDD (مساحات كبيرة)</span>
            </button>
          </div>
        </div>

        {/* Hard Drive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrives.map((drive) => {
            const activeCapIndex = selectedCapacities[drive.id] || 0;
            const currentCap = drive.capacityOptions[activeCapIndex];

            return (
              <div
                key={drive.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:border-[#CCFF00]/70 hover:shadow-[0_12px_32px_rgba(204,255,0,0.12)]"
              >
                {/* Top Subtle Edge Highlight */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  {/* Top Bar: Badge & Type */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-black ${drive.badgeColor}`}>
                      {drive.badge}
                    </span>
                    <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] font-mono font-bold text-zinc-300">
                      {drive.type}
                    </span>
                  </div>

                  {/* Drive Image */}
                  <div className="relative mb-5 h-44 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-black/40">
                    <img
                      src={drive.image}
                      alt={drive.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 start-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#CCFF00]">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>{drive.speed}</span>
                    </div>
                  </div>

                  {/* Drive Title & Description */}
                  <h3 className="text-lg font-black text-[var(--text-primary)] group-hover:text-[#CCFF00] transition-colors">
                    {drive.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                    {drive.description}
                  </p>

                  {/* Features Bullet List */}
                  <div className="mt-4 space-y-1.5 border-t border-[var(--border)] pt-3.5">
                    {drive.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#CCFF00] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Capacity Selector Tabs */}
                  <div className="mt-5">
                    <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-2">
                      {isAr ? 'اختر السعة التخزينية:' : 'Select Capacity:'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {drive.capacityOptions.map((cap, idx) => (
                        <button
                          key={cap.size}
                          type="button"
                          onClick={() => handleSelectCapacity(drive.id, idx)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                            activeCapIndex === idx
                              ? 'bg-[#CCFF00] text-black font-black shadow-[0_0_10px_rgba(204,255,0,0.3)]'
                              : 'border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-white'
                          }`}
                        >
                          {cap.size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer: Price & Order Action */}
                <div className="mt-6 border-t border-[var(--border)] pt-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">
                      {isAr ? 'السعر التقديري للهارد' : 'ESTIMATED DRIVE PRICE'}
                    </span>
                    <div className="mt-0.5 flex items-baseline gap-1">
                      <span className="text-xl font-black text-[var(--text-primary)]">
                        {formatNumber(currentCap.price)}
                      </span>
                      <span className="text-xs font-bold text-[#CCFF00]">
                        {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOrderDrive(drive)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#CCFF00] px-4 py-2.5 text-xs font-black text-black shadow-md transition-all hover:bg-[#B8E600] hover:scale-105"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{isAr ? 'طلب مع الألعاب' : 'Order With Games'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Chat Guarantee Bar */}
        <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-start">
            <div className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CCFF00]/15 text-[#CCFF00]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  {isAr ? 'ضمان استبدال معتمد' : 'Official Local Warranty'}
                </h4>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {isAr ? 'هاردات جديدة أصلية 100% مغلفة بالكرتونة وضمان ضد عيوب الصناعة.' : '100% brand new sealed hard drives with official manufacturer warranty.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CCFF00]/15 text-[#CCFF00]">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  {isAr ? 'اتفاق ودفع مباشر في الشات' : 'Direct Support Chat Payment'}
                </h4>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {isAr ? 'شات فوري في الداش بورد للاتفاق على الهارد والدفع السهل عبر إنستاباي/كاش.' : 'Instant dashboard chat to coordinate drive model and easy digital payment.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CCFF00]/15 text-[#CCFF00]">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  {isAr ? 'توصيل لباب بيتك جاهزاً' : 'Delivered Loaded to Doorstep'}
                </h4>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {isAr ? 'نملأ الهارد بألعابك كاملة ومفحوصة ونسلمه إياك في 24-48 ساعة لتلعب فوراً!' : 'We load your chosen games, verify integrity, and deliver in 1-2 days!'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
