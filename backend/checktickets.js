const db = require("./config/database");

db.all(
  `SELECT tickets.user_id, tickets.event_id, tickets.quantity,
          tickets.purchase_date, events.title AS event_title, events.event_date,
          users.email AS user_email
   FROM tickets
   LEFT JOIN events ON tickets.event_id = events.id
   LEFT JOIN users ON tickets.user_id = users.id`,
  [],
  (err, rows) => {
    if (err) {
      console.error("Error querying tickets:", err.message);
    } else {
      console.log("Tickets in DB:");
      console.table(rows);
    }
    db.close();
  }
);