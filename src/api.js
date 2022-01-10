require('dotenv').config();
__non_webpack_require__("babel-core/register");
__non_webpack_require__("babel-polyfill");

const express = __non_webpack_require__("express");
const serverless = __non_webpack_require__("serverless-http");

const connectDB = require("../config/db");

// Connect database
connectDB();

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});
app.use(express.json({ extended: false }));

app.post("/", (req, res) => res.json({ postBody: req.body }));
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});
app.use(`/.netlify/functions/api`, router);
// Define Routes
app.use("/.netlify/functions/api/users", require("../routes/api/users"));
app.use("/.netlify/functions/api/auth", require("../routes/api/auth"));
app.use("/.netlify/functions/api/profile", require("../routes/api/profile"));
app.use("/.netlify/functions/api/contacts", require("../routes/api/contacts"));

module.exports = app;
module.exports.handler = serverless(app);