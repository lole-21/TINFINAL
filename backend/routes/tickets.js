const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authenticateToken = require("../middleware/auth");


router.get("/", authenticateToken, (req, res) => {
  let sql = `
    SELECT tickets.id, tickets.user_id, tickets.event_id, tickets.quantity, tickets.purchase_date,
           events.title AS event_title, events.event_date,
           users.email AS user_email
    FROM tickets
    LEFT JOIN events ON tickets.event_id = events.id
    LEFT JOIN users ON tickets.user_id = users.id
  `;
  const params = [];
  if (req.user.role !== "admin") {
    sql += " WHERE tickets.user_id = ?";
    params.push(req.user.id);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.post("/", authenticateToken, (req, res) => {
  const { event_id, quantity } = req.body;
  const user_id = req.user.id;
  if (!event_id || !quantity || quantity < 1) return res.status(400).json({ error: "Event and quantity required" });

  const sql = `INSERT INTO tickets (user_id, event_id, quantity) VALUES (?, ?, ?)`;
  db.run(sql, [user_id, event_id, quantity], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    const query = `
      SELECT tickets.id, tickets.user_id, tickets.event_id, tickets.quantity, tickets.purchase_date,
             events.title AS event_title, events.event_date
      FROM tickets
      LEFT JOIN events ON tickets.event_id = events.id
      WHERE tickets.id = ?
    `;
    db.get(query, [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});


router.delete("/:id", authenticateToken, (req, res) => {
  const ticketId = req.params.id;
  db.get("SELECT * FROM tickets WHERE id = ?", [ticketId], (err, ticket) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    if (req.user.role !== "admin" && ticket.user_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    db.run("DELETE FROM tickets WHERE id = ?", [ticketId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Ticket deleted successfully" });
    });
  });
});

module.exports = router;
