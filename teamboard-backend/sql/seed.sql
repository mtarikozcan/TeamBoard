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
  'ali@teamboard.com',
  'ayse@teamboard.com',
  'mehmet@teamboard.com'
);

-- ============================================================
-- KULLANICILAR
-- ============================================================
INSERT INTO users (id, name, email, password_hash) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Ali Yılmaz',     'ali@teamboard.com',    '$2a$12$DxoZph7bLegNksusumNgEuXTRnHI/MyGUaizsz3MtN9XEvAexzrmq'),
  ('a2000000-0000-0000-0000-000000000002', 'Ayşe Kaya',      'ayse@teamboard.com',   '$2a$12$JeMcdDq.KmswEYbwNqCyvO9Hiq0wWesP710JmLSgLRVkyyjGpg3W2'),
  ('a3000000-0000-0000-0000-000000000003', 'Mehmet Demir',   'mehmet@teamboard.com', '$2a$12$NvAkTj8eFFyMK9wsvHuhKecFH63//HVqPyOAw2.ef2sGzdbDIl46e');

-- ============================================================
-- PROJELER
-- ============================================================
INSERT INTO projects (id, name, description, owner_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'E-Ticaret Platformu', 'Tam kapsamlı e-ticaret altyapısı geliştirme projesi', 'a1000000-0000-0000-0000-000000000001'),
  ('b2000000-0000-0000-0000-000000000002', 'Mobil Uygulama',      'iOS ve Android için React Native mobil uygulama',    'a2000000-0000-0000-0000-000000000002');

-- ============================================================
-- PROJE ÜYELİKLERİ
-- ============================================================

-- E-Ticaret: Ali admin, Ayşe member, Mehmet member
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'admin'),
  ('b1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 'member'),
  ('b1000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000003', 'member');

-- Mobil Uygulama: Ayşe admin, Ali member
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('b2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'admin'),
  ('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'member');

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
  -- Ödeme entegrasyonu
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Stripe ve iyzico entegrasyonunu değerlendiriyorum, ikisi için de sandbox test hazır.'),
  ('c1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', '3D Secure zorunlu mu? Mevzuat açısından kontrol ettim, gerekli görünüyor.'),

  -- Kullanıcı kimlik doğrulama
  ('c1000000-0000-0000-0000-000000000004', 'a2000000-0000-0000-0000-000000000002', 'JWT refresh token mekanizması eklendi, access token süresi 15 dakikaya düşürüldü.'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Harika, bu sayede güvenlik çok daha iyi olacak. OAuth entegrasyonu da gelecek mi?'),
  ('c1000000-0000-0000-0000-000000000004', 'a3000000-0000-0000-0000-000000000003', 'Google OAuth için gereksinim dokümanı hazır, bir sonraki sprint''e alabiliriz.'),

  -- Veritabanı tasarımı (done)
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Şema finalize edildi, indeksler eklendi. Review için PR açıldı.'),
  ('c1000000-0000-0000-0000-000000000006', 'a3000000-0000-0000-0000-000000000003', 'İnceledim, LGTM. Merge edebilirsin.'),

  -- UI tasarımı (mobil)
  ('c2000000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000002', 'Figma prototipi tamamlandı, komponent kütüphanesi oluşturuluyor.'),
  ('c2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Dark mode desteği de ekleyelim mi? Kullanıcı araştırmasında çok isteniyor.');
