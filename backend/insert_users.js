const db = require("./config/database");
const bcrypt = require("bcryptjs");

const users = [
  { email: "admin@example.com", password: "admin123", role: "admin", language: "en" },
  { email: "user1@example.com", password: "user123", role: "user", language: "en" },
  { email: "user2@example.com", password: "user123", role: "user", language: "en" }
];

users.forEach(user => {
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) throw err;
    const sql = "INSERT OR IGNORE INTO users (email, password_hash, role, language) VALUES (?, ?, ?, ?)";
    db.run(sql, [user.email, hash, user.role, user.language], function(err) {
      if (err) console.error(err.message);
      else console.log(`User ${user.email} inserted/exists`);
    });
  });
});
