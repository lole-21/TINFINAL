const db = require("./config/database");
const bcrypt = require("bcryptjs");

const email = "user1@example.com";
const newPassword = "user123"; 

bcrypt.hash(newPassword, 10, (err, hash) => {
  if (err) throw err;

  const sql = "UPDATE users SET password_hash = ? WHERE email = ?";
  db.run(sql, [hash, email], function(err) {
    if (err) throw err;
    if (this.changes === 0) {
      console.log("No user found with that email.");
    } else {
      console.log(`Password for ${email} has been reset.`);
    }
    db.close();
  });
});
