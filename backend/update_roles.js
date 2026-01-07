const db = require("./config/database");


db.get("PRAGMA table_info(users)", (err, columns) => {
  if (err) throw err;

  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) throw err;

    const columnNames = rows.map(r => r.name);

    if (!columnNames.includes("role")) {
      db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
      console.log("Added role column");
    } else {
      console.log("Role column already exists");
    }

    if (!columnNames.includes("language")) {
      db.run("ALTER TABLE users ADD COLUMN language TEXT DEFAULT 'en'");
      console.log("Added language column");
    } else {
      console.log("Language column already exists");
    }
  });
});
