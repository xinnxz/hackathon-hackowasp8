const express = require("express");

const app = express();

const allowedOrigins = new Set(["https://guardrail.demo"]);

function requireAdmin(req, res, next) {
  if (req.headers.authorization !== "Bearer demo-admin-token") {
    return res.status(403).json({ error: "forbidden" });
  }
  next();
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  next();
});

app.get("/admin/users", requireAdmin, (req, res) => {
  const userId = Number.parseInt(String(req.query.userId ?? "0"), 10);

  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: "invalid user id" });
  }

  const query = "SELECT * FROM users WHERE id = ?";
  return res.json({
    status: "safer",
    query,
    parameters: [userId],
  });
});

app.listen(3001, () => {
  console.log("Fixed demo listening on http://localhost:3001");
});
