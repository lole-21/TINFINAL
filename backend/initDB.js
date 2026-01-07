const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "db", "eventhub.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error(err.message);
  console.log("Connected to SQLite database.");
});

db.serialize(() => {
  // USERS
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      language TEXT NOT NULL DEFAULT 'en'
    )
  `);

  // EVENTS
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      event_date DATETIME NOT NULL,
      organizer_id INTEGER,
      FOREIGN KEY (organizer_id) REFERENCES users(id)
    )
  `);

  // TICKETS
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id)
    )
  `);

  console.log("Tables created (if not exist).");

  // SAMPLE USERS
  db.run(`
    INSERT OR IGNORE INTO users (id, email, password_hash, role, language) VALUES
    (1, 'admin@example.com', 'hashedpassword1', 'admin', 'en'),
    (2, 'user1@example.com', 'hashedpassword2', 'user', 'en'),
    (3, 'user2@example.com', 'hashedpassword3', 'user', 'en')
  `);

  // SAMPLE EVENTS
  db.run(`
    INSERT OR IGNORE INTO events (id, title, description, event_date, organizer_id) VALUES
    (1, 'Concert', 'Live music concert', '2026-02-01 19:00', 1),
    (2, 'Workshop', 'Web development workshop', '2026-02-10 10:00', 1)
  `);

  // SAMPLE TICKETS (remove OR IGNORE if you want to always reset)
  db.run(`
    INSERT INTO tickets (user_id, event_id, quantity) VALUES
    (2,1,2),
    (3,1,1),
    (2,2,1)
  `);

  console.log("Sample data inserted.");
});

db.close((err) => {
  if (err) return console.error(err.message);
  console.log("Database connection closed.");
});
