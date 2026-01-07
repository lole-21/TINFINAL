const express = require("express");
const router = express.Router();
const db = require("../config/database");
const jwt = require("jsonwebtoken");


const SECRET = "your_jwt_secret"; 

router.post("/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.get(sql, [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    
    if (password !== user.password_hash) return res.status(401).json({ error: "Invalid credentials" });

   
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

module.exports = router;
