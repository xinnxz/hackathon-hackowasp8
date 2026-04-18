const express = require("express");

const app = express();

const apiToken = "ghp_1234567890abcdefghijklmnopqrstuv";
const dbPassword = "SuperSecretKey123456789";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/admin/users", (req, res) => {
  const userId = req.query.userId;
  const query = "SELECT * FROM users WHERE id = " + userId;

  res.json({
    status: "unsafe",
    query,
    tokenPreview: apiToken.slice(0, 10),
    passwordLength: dbPassword.length,
  });
});

app.listen(3000, () => {
  console.log("Vulnerable demo listening on http://localhost:3000");
});
