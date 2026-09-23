# Masjid Prayer Display System

Sistem Digital Signage Masjid dengan dukungan Fullscreen, Screen Wake Lock, dan realtime Socket.IO.

## Requirements

- Node.js (v18 / v20 LTS recommended)
- PostgreSQL
- Nginx
- PM2 (Process Manager)

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Konfigurasi Database:
   - Buat database `masjid_db` di PostgreSQL.
   - Sesuaikan file `backend/.env` pada variabel `DATABASE_URL`.
   - Jalankan migrasi Prisma:
     ```bash
     cd backend
     npx prisma db push
     npx prisma generate
     ```

3. Jalankan development server:
   ```bash
   # Di root direktori proyek:
   npm run dev
   ```

## Production Deployment (VPS Ubuntu)

### 1. Build Frontend
```bash
cd frontend
npm run build
```

### 2. PM2 (Backend)
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 3. Nginx Configuration
Aplikasi ini di-desain berjalan di base path `/masjid`. Tambahkan block berikut pada file konfigurasi site Nginx yang sudah ada (misalnya untuk `cg-plantbatam.com`):

```nginx
location /masjid/api/ {
    proxy_pass http://127.0.0.1:4001/masjid/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

location /masjid/socket.io/ {
    proxy_pass http://127.0.0.1:4001/masjid/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
}

location /masjid/ {
    alias /var/www/masjid/frontend/dist/;
    try_files $uri $uri/ /masjid/index.html;
}
```

## Panduan TV & Digital Signage (Kiosk Mode)

Aplikasi dirancang dengan **Screen Wake Lock API** dan **Fullscreen API**. Namun, browser web pada Smart TV tidak selalu mendapatkan hak penuh untuk mem-bypass OS Power Saving.

### Rekomendasi Setup Terbaik (24/7 Unattended)
Gunakan **Mini PC** (Windows/Linux) atau **Android Box** daripada native Smart TV Browser.

**Mode Kiosk Chromium (Mini PC):**
```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  https://cg-plantbatam.com/masjid
```

### Checklist Pengaturan TV Installer
Installer WAJIB mengubah pengaturan TV secara manual menggunakan remote TV untuk mencegah TV mati:
- Energy Saving / Eco Mode → **OFF**
- Auto Power Off / Sleep Timer → **OFF**
- No Signal Power Off → **OFF**
- Idle TV Standby → **OFF**
- Screen Saver / Ambient Mode → **OFF**

Aplikasi akan berusaha secara otomatis mendapatkan `Wake Lock` setiap kali layar kembali aktif (visible).
