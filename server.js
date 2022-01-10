require('dotenv').config();
const express = require("express");
const app = express();
const serverless = require("serverless-http");
const connectDB = require("./config/db");

// Connect database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

app.get("/", (req, res) => res.send("API Running"));

app.post("/", (req, res) => res.send(req));
// Define Routes
app.use("/.netlify/functions/api/users", require("./routes/api/users"));
app.use("/.netlify/functions/api/auth", require("./routes/api/auth"));
app.use("/.netlify/functions/api/profile", require("./routes/api/profile"));
app.use("/.netlify/functions/api/contacts", require("./routes/api/contacts"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
  console.log(`🏎  ✔ Server started on port ${PORT} (/server.js)`)
);

module.exports = app;
module.exports.handler = serverless(app);