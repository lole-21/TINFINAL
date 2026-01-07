const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "db", "eventhub.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Could not connect to database", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

module.exports = db;
