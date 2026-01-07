const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authenticateToken = require("../middleware/auth");


router.get("/", (req, res) => {
  const sql = `
    SELECT 
      events.id,
      events.title,
      events.description,
      events.event_date,
      events.organizer_id,
      users.email AS organizer_email
    FROM events
    LEFT JOIN users ON events.organizer_id = users.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.post("/", authenticateToken, (req, res) => {
  const { title, description, event_date } = req.body;

  const sql = `
    INSERT INTO events (title, description, event_date, organizer_id)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [title, description, event_date, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: this.lastID,
        title,
        description,
        event_date,
        organizer_id: req.user.id,
        organizer_email: req.user.email,
      });
    }
  );
});


router.put("/:id", authenticateToken, (req, res) => {
  const { title, description, event_date } = req.body;
  const eventId = req.params.id;

  db.get("SELECT * FROM events WHERE id = ?", [eventId], (err, event) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (req.user.role !== "admin" && event.organizer_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const sql = `
      UPDATE events
      SET title = ?, description = ?, event_date = ?
      WHERE id = ?
    `;

    db.run(sql, [title, description, event_date, eventId], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: Number(eventId),
        title,
        description,
        event_date,
        organizer_id: event.organizer_id,
      });
    });
  });
});


router.delete("/:id", authenticateToken, (req, res) => {
  const eventId = req.params.id;

  db.get("SELECT * FROM events WHERE id = ?", [eventId], (err, event) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (req.user.role !== "admin" && event.organizer_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    db.run("DELETE FROM events WHERE id = ?", [eventId], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Event deleted" });
    });
  });
});

module.exports = router;
