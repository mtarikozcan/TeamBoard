-- TeamBoard Seed Data
-- Çalıştırmak için: psql $DATABASE_URL -f sql/seed.sql
-- NOT: Mevcut seed verisi varsa önce temizler (idempotent)

-- ============================================================
-- CLEANUP (yeniden çalıştırılabilir olması için)
-- ============================================================
DELETE FROM comments;
DELETE FROM tasks;
DELETE FROM project_members;
DELETE FROM projects;
DELETE FROM users WHERE email IN (
  'admin@teamboard.com',
  'ali@teamboard.com',
  'ayse@teamboard.com',
  'mehmet@teamboard.com'
);

-- ============================================================
-- KULLANICILAR
-- ============================================================
-- Şifreler: admin123 (admin), 123456 (diğerleri)
INSERT INTO users (id, name, email, password_hash) VALUES
  ('a0000000-0000-0000-0000-000000000000', 'Admin Kullanıcı',  'admin@teamboard.com',  '$2a$12$wL1EZWjQ31VwY6P31RF2HeVZzLxwf62tso10GnHLZL15BMkcLEUVS'),
  ('a1000000-0000-0000-0000-000000000001', 'Ali Yılmaz',       'ali@teamboard.com',    '$2a$12$DxoZph7bLegNksusumNgEuXTRnHI/MyGUaizsz3MtN9XEvAexzrmq'),
  ('a2000000-0000-0000-0000-000000000002', 'Ayşe Kaya',        'ayse@teamboard.com',   '$2a$12$JeMcdDq.KmswEYbwNqCyvO9Hiq0wWesP710JmLSgLRVkyyjGpg3W2'),
  ('a3000000-0000-0000-0000-000000000003', 'Mehmet Demir',     'mehmet@teamboard.com', '$2a$12$NvAkTj8eFFyMK9wsvHuhKecFH63//HVqPyOAw2.ef2sGzdbDIl46e');

-- ============================================================
-- PROJELER
-- ============================================================
INSERT INTO projects (id, name, description, owner_id) VALUES
  -- Admin'in projeleri
  ('b0000000-0000-0000-0000-000000000001', 'SaaS Dashboard',         'Müşteri analitiği ve raporlama platformu geliştirme projesi',     'a0000000-0000-0000-0000-000000000000'),
  ('b0000000-0000-0000-0000-000000000002', 'DevOps Altyapısı',       'CI/CD pipeline, Docker ve Kubernetes cluster kurulum projesi',    'a0000000-0000-0000-0000-000000000000'),
  -- Mevcut projeler
  ('b1000000-0000-0000-0000-000000000001', 'E-Ticaret Platformu',    'Tam kapsamlı e-ticaret altyapısı geliştirme projesi',             'a1000000-0000-0000-0000-000000000001'),
  ('b2000000-0000-0000-0000-000000000002', 'Mobil Uygulama',         'iOS ve Android için React Native mobil uygulama',                 'a2000000-0000-0000-0000-000000000002');

-- ============================================================
-- PROJE ÜYELİKLERİ
-- ============================================================

-- SaaS Dashboard: Admin owner/admin, Ali member, Ayşe member, Mehmet member
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'admin'),
  ('b0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'member'),
  ('b0000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 'member'),
  ('b0000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000003', 'member');

-- DevOps Altyapısı: Admin owner/admin, Mehmet member, Ali member
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'admin'),
  ('b0000000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000003', 'member'),
  ('b0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'member');

-- E-Ticaret: Ali admin, Ayşe member, Mehmet member, Admin member
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'admin'),
  ('b1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 'member'),
  ('b1000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000003', 'member'),
  ('b1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'member');

-- Mobil Uygulama: Ayşe admin, Ali member, Admin member
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('b2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'admin'),
  ('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'member'),
  ('b2000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'member');

-- ============================================================
-- GÖREVLER — SaaS Dashboard
-- ============================================================

-- Todo
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'Çok kiracılı mimari tasarımı',       'todo', 'high'),
  ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000001', 'Abonelik ve faturalandırma modülü',  'todo', 'high'),
  ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000002', 'Gerçek zamanlı bildirim sistemi',    'todo', 'medium'),
  ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', NULL,                                   'A/B test altyapısı',                 'todo', 'low');

-- In Progress
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'Kullanıcı davranış analizi paneli', 'inprogress', 'high'),
  ('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000003', 'Özel rapor oluşturucu',             'inprogress', 'medium'),
  ('d0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000001', 'REST API dokümantasyonu (Swagger)',  'inprogress', 'medium');

-- Done
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('d0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'Proje mimarisi ve teknoloji seçimi', 'done', 'high'),
  ('d0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a2000000-0000-0000-0000-000000000002', 'Auth servisi (OAuth2 + JWT)',        'done', 'high'),
  ('d0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000003', 'Veritabanı şema tasarımı',          'done', 'medium');

-- ============================================================
-- GÖREVLER — DevOps Altyapısı
-- ============================================================

-- Todo
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('d0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'Kubernetes cluster auto-scaling',  'todo', 'high'),
  ('d0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000003', 'Secret management (Vault)',        'todo', 'high'),
  ('d0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', NULL,                                   'Log aggregation (ELK Stack)',      'todo', 'medium');

-- In Progress
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('d0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'GitHub Actions CI/CD pipeline',    'inprogress', 'high'),
  ('d0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000001', 'Docker image optimizasyonu',       'inprogress', 'medium');

-- Done
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('d0000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000000', 'Geliştirme ortamı kurulumu',        'done', 'high'),
  ('d0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'a3000000-0000-0000-0000-000000000003', 'Dockerfile ve docker-compose',      'done', 'medium'),
  ('d0000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000000', 'a1000000-0000-0000-0000-000000000001', 'AWS IAM roller ve policy tanımı',   'done', 'high');

-- ============================================================
-- GÖREVLER — E-Ticaret Platformu
-- ============================================================

-- Todo
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Ödeme entegrasyonu',   'todo', 'high'),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', NULL,                                   'SEO optimizasyonu',    'todo', 'medium'),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000003', 'Email bildirimleri',   'todo', 'low');

-- In Progress
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 'Kullanıcı kimlik doğrulama', 'inprogress', 'high'),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Ürün filtreleme sistemi',   'inprogress', 'medium');

-- Done
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Veritabanı tasarımı', 'done', 'high'),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000003', 'API endpoint''leri',  'done', 'medium');

-- ============================================================
-- GÖREVLER — Mobil Uygulama
-- ============================================================

-- Todo
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('c2000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', NULL,                                   'Push notification', 'todo', 'high'),
  ('c2000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Offline mod',       'todo', 'medium');

-- In Progress
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('c2000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'UI tasarımı', 'inprogress', 'high');

-- Done
INSERT INTO tasks (id, project_id, created_by, assigned_to, title, status, priority) VALUES
  ('c2000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'Proje kurulumu', 'done', 'low');

-- ============================================================
-- YORUMLAR
-- ============================================================
INSERT INTO comments (task_id, user_id, content) VALUES
  -- SaaS Dashboard: Kullanıcı davranış analizi
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000000', 'Mixpanel benzeri funnel analizi ekleyeceğiz. İlk prototipi hazırladım.'),
  ('d0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'Retention cohort görselleştirmesi de öncelikli listeye alalım.'),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000000', 'Kesinlikle, D7/D30 retention grafikleri de speklerimizde var.'),

  -- SaaS Dashboard: Auth servisi (done)
  ('d0000000-0000-0000-0000-000000000009', 'a2000000-0000-0000-0000-000000000002', 'OAuth2 authorization code flow tamamlandı. Google ve GitHub provider eklendi.'),
  ('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000000', 'Mükemmel! Refresh token rotasyonu da çalışıyor mu?'),
  ('d0000000-0000-0000-0000-000000000009', 'a2000000-0000-0000-0000-000000000002', 'Evet, sliding window ile implement ettim. PR incelemesine hazır.'),

  -- DevOps: GitHub Actions CI/CD
  ('d0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000000', 'Build → test → staging deploy pipeline hazır. Production deploy için manuel onay koydum.'),
  ('d0000000-0000-0000-0000-000000000014', 'a3000000-0000-0000-0000-000000000003', 'Paralel test koşturmayı ekleyelim, şu an 8 dakika sürüyor.'),
  ('d0000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000001', 'Test matris stratejisi ile node 18/20 üzerinde paralel koşturulabilir.'),
  ('d0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000000', 'Harika fikir, bu sprint''e alıyorum.'),

  -- DevOps: Dockerfile (done)
  ('d0000000-0000-0000-0000-000000000017', 'a3000000-0000-0000-0000-000000000003', 'Multi-stage build ile image boyutu 1.2GB''dan 180MB''a düştü.'),
  ('d0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000000', 'Çok iyi optimizasyon! Non-root user ile çalıştırıyor muyuz?'),
  ('d0000000-0000-0000-0000-000000000017', 'a3000000-0000-0000-0000-000000000003', 'Evet, node:20-alpine base alındı ve UID 1001 ile çalışıyor.'),

  -- E-Ticaret: Ödeme entegrasyonu
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Stripe ve iyzico entegrasyonunu değerlendiriyorum, ikisi için de sandbox test hazır.'),
  ('c1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', '3D Secure zorunlu mu? Mevzuat açısından kontrol ettim, gerekli görünüyor.'),
  ('c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 'BDDK düzenlemeleri açısından 3DS2 zorunlu. iyzico bu konuda daha uyumlu.'),

  -- E-Ticaret: Kullanıcı kimlik doğrulama
  ('c1000000-0000-0000-0000-000000000004', 'a2000000-0000-0000-0000-000000000002', 'JWT refresh token mekanizması eklendi, access token süresi 15 dakikaya düşürüldü.'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Harika, bu sayede güvenlik çok daha iyi olacak. OAuth entegrasyonu da gelecek mi?'),
  ('c1000000-0000-0000-0000-000000000004', 'a3000000-0000-0000-0000-000000000003', 'Google OAuth için gereksinim dokümanı hazır, bir sonraki sprint''e alabiliriz.'),

  -- E-Ticaret: Veritabanı tasarımı (done)
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Şema finalize edildi, indeksler eklendi. Review için PR açıldı.'),
  ('c1000000-0000-0000-0000-000000000006', 'a3000000-0000-0000-0000-000000000003', 'İnceledim, LGTM. Merge edebilirsin.'),

  -- Mobil: UI tasarımı
  ('c2000000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000002', 'Figma prototipi tamamlandı, komponent kütüphanesi oluşturuluyor.'),
  ('c2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Dark mode desteği de ekleyelim mi? Kullanıcı araştırmasında çok isteniyor.');
