const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = "TINSECRET"; 


router.post("/register", async (req, res) => {
  const { email, password, role, language } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const password_hash = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (email, password_hash, role, language)
    VALUES (?, ?, ?, ?)
  `;
  db.run(sql, [email, password_hash, role || "user", language || "en"], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, email, role, language });
  });
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

module.exports = router;
