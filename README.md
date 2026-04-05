# TeamBoard

Ekiplerin projelerini ve görevlerini yönetebileceği, Jira'nın sadeleştirilmiş versiyonu olarak tasarlanmış web tabanlı görev yönetim sistemi.

## Özellikler

- Kullanıcı kayıt ve giriş (JWT)
- Proje oluşturma ve üye yönetimi
- Kanban board (To Do / In Progress / Done)
- Görev oluşturma, atama, önceliklendirme
- Görev yorumları
- Drag & drop ile status güncelleme

## Teknolojiler

### Backend

- Node.js + Express.js
- PostgreSQL (AWS RDS)
- JWT authentication
- bcrypt, Helmet.js, express-rate-limit, Joi

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v3
- @hello-pangea/dnd (drag & drop)

## Bulut Altyapısı (AWS)

- EC2 (t3.micro) — Backend sunucusu
- RDS (db.t4g.micro) — PostgreSQL veritabanı
- PM2 — Process manager

## Mimari

```
Kullanıcı → Frontend (EC2:3006) → Backend API (EC2:3007) → PostgreSQL (RDS)
```

## Canlı Demo

- Frontend: http://13.60.69.215:3006
- Backend API: http://13.60.69.215:3007/api

## Kurulum (Local Development)

### Backend

```bash
cd teamboard-backend
npm install
# .env dosyasını oluştur (.env.example'a bak)
npm run dev
```

### Frontend

```bash
cd teamboard-frontend
pnpm install
# .env.local dosyasını oluştur
pnpm dev
```

## Environment Değişkenleri

### Backend (.env)

| Değişken | Açıklama |
|----------|----------|
| PORT | Sunucu portu |
| DATABASE_URL | PostgreSQL bağlantı URL'i |
| JWT_SECRET | JWT imzalama anahtarı |
| JWT_EXPIRES_IN | Token geçerlilik süresi |
| FRONTEND_URL | CORS için frontend URL'i |

### Frontend (.env.local)

| Değişken | Açıklama |
|----------|----------|
| NEXT_PUBLIC_API_URL | Backend API URL'i |

## API Endpoint'leri

### Auth

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | /api/auth/register | Kayıt |
| POST | /api/auth/login | Giriş |
| GET | /api/auth/me | Profil |

### Projects

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/projects | Projeleri listele |
| POST | /api/projects | Proje oluştur |
| GET | /api/projects/:id | Proje detayı |
| PUT | /api/projects/:id | Güncelle |
| DELETE | /api/projects/:id | Sil |
| POST | /api/projects/:id/members | Üye ekle |
| DELETE | /api/projects/:id/members/:userId | Üye çıkar |

### Tasks

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/projects/:id/tasks | Görevleri listele |
| POST | /api/projects/:id/tasks | Görev oluştur |
| GET | /api/tasks/:id | Görev detayı |
| PUT | /api/tasks/:id | Güncelle |
| DELETE | /api/tasks/:id | Sil |

### Comments

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/tasks/:id/comments | Yorumları listele |
| POST | /api/tasks/:id/comments | Yorum ekle |
| DELETE | /api/comments/:id | Yorum sil |

## Veritabanı Şeması

5 tablo: `users`, `projects`, `project_members`, `tasks`, `comments`

## Geliştirici

- GitHub: https://github.com/mtarikozcan/TeamBoard
