# دليل رفع موقع GIGADROP على GitHub ثم Hostinger خطوة بخطوة

تم تجهيز المستودع البرمجي (`Git Repository`) بالكامل داخل المشروع مع ملفات التوافق الخاصة بـ **Hostinger** ([`server.js`](file:///c:/Users/Mohamed%20Nagy/OneDrive%20-%20Arab%20Open%20University%20-%20AOU/Desktop/ahmed%20store/server.js) و [`package.json`](file:///c:/Users/Mohamed%20Nagy/OneDrive%20-%20Arab%20Open%20University%20-%20AOU/Desktop/ahmed%20store/package.json) و [`.gitignore`](file:///c:/Users/Mohamed%20Nagy/OneDrive%20-%20Arab%20Open%20University%20-%20AOU/Desktop/ahmed%20store/.gitignore)).

---

## الخطوة الأولى: رفع المشروع على حسابك في GitHub

1. افتح موقع **[GitHub — Create New Repository](https://github.com/new)**.
2. اكتب اسم المستودع مثلاً: `gigadrop-store` واجعله **Private** (أو Public حسب رغبتك)، ثم اضغط **Create repository** (بدون إضافة README أو .gitignore لأننا جهزناهم بالفعل).
3. انسخ رابط المستودع الذي سيظهر لك (مثلاً: `https://github.com/YOUR-USERNAME/gigadrop-store.git`) وأرسله لي هنا لأقوم برفعه لك فوراً، أو نفذ الأمرين التاليين في التيرمينال:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/gigadrop-store.git
   git push -u origin main
   ```

---

## الخطوة الثانية: تجهيز قاعدة بيانات MySQL على Hostinger

1. ادخل إلى لوحة تحكم **Hostinger (hPanel)** -> قسم **Databases (قواعد البيانات)** -> **Management**.
2. أنشئ قاعدة بيانات MySQL جديدة واحتفظ بالبيانات التالية:
   * **MySQL Database Name** (مثلاً: `u123456789_gigadrop`)
   * **MySQL Username** (مثلاً: `u123456789_admin`)
   * **Password** (كلمة مرور قاعدة البيانات)
   * **MySQL Host** (غالباً `localhost` أو عنوان السيرفر الظاهر في hPanel)
3. يكون رابط قاعدة البيانات `DATABASE_URL` بهذا الشكل:
   ```env
   DATABASE_URL="mysql://u123456789_admin:YOUR_DB_PASSWORD@localhost:3306/u123456789_gigadrop"
   ```

---

## الخطوة الثالثة: ربط GitHub بـ Hostinger وتشغيل الموقع

### أ) إذا كنت تستخدم استضافة Hostinger الداعمة لـ Node.js (Cloud / Business Web Hosting أو VPS مع CloudPanel/Coolify)
1. من لوحة **Hostinger hPanel**، اذهب إلى **Advanced** -> **GIT** (أو **Node.js Web App**).
2. اربط حسابك في **GitHub** واختر المستودع `gigadrop-store` والفرع `main`.
3. إعدادات تشغيل تطبيق Node.js على Hostinger:
   * **Node.js Version**: `20.x` (أو `18.x`)
   * **Application startup file (ملف البدء)**: `server.js`
   * **Build command**: `npm run build`
   * **Start command**: `npm run start`
4. أضف المتغيرات البيئية (**Environment Variables**) في لوحة Hostinger:
   ```env
   DATABASE_URL="mysql://u123456789_admin:YOUR_DB_PASSWORD@localhost:3306/u123456789_gigadrop"
   NEXTAUTH_SECRET="gigadrop-production-secret-key-2026-secure"
   NEXTAUTH_URL="https://your-domain.com"
   NEXT_PUBLIC_APP_URL="https://your-domain.com"
   NEXT_PUBLIC_STORE_WHATSAPP="201012345678"
   ```
5. لبناء الجداول ورفع الألعاب الـ 52 وحساب الأدمن لأول مرة داخل قاعدة البيانات، افتح SSH (أو Terminal في Hostinger) وشغّل:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

### ب) إذا كنت تستخدم Hostinger VPS (Ubuntu / Docker)
1. اسحب المشروع من GitHub داخل الـ VPS:
   ```bash
   git clone https://github.com/YOUR-USERNAME/gigadrop-store.git
   cd gigadrop-store
   ```
2. شغّل الموقع وقاعدة البيانات بأمر واحد عبر Docker:
   ```bash
   docker compose up -d --build
   ```
