const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const eventsRouter = require("./routes/events");
app.use("/api/events", eventsRouter);

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

const ticketsRoutes = require("./routes/tickets");
app.use("/api/tickets", ticketsRoutes);

const loginRouter = require("./routes/login");
app.use("/api/login", loginRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
