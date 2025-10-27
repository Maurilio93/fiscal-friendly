// micro server per test Passenger
const express = require("express");
const app = express();

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "probe" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("PROBE up on :" + PORT));
