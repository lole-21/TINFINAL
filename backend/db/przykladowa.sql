
INSERT INTO users (email, password_hash, role, language) VALUES
('admin@example.com', 'hashedpassword1', 'admin', 'en'),
('user1@example.com', 'hashedpassword2', 'user', 'en'),
('user2@example.com', 'hashedpassword3', 'user', 'en');


INSERT INTO events (title, description, event_date, organizer_id) VALUES
('Concert', 'Live music concert', '2026-02-01 19:00', 1),
('Workshop', 'Web development workshop', '2026-02-10 10:00', 1);


INSERT INTO tickets (user_id, event_id, quantity) VALUES
(2, 1, 2),
(3, 1, 1),
(2, 2, 1);
