INSERT INTO rooms (id, name)
VALUES ('global', 'Global Room')
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (room_id, user_name, text)
VALUES
  ('global', 'bot', 'ようこそ。ここは全員共通のルームです。'),
  ('global', 'bot', 'メッセージを投稿してみてください。');
