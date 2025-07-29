const express = require("express");
const mysql = require("mysql2");
const path = require("path"); // ✅ Import path module
const cors = require("cors");
const app = express();

app.use(cors());
// Serve static frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// DB connection
const db = mysql.createConnection({
  host: "localhost", // or your remote DB host
  user: "root",
  password: "",
  database: "insurance"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL: Up & Running!");
});

// API endpoint to fetch hospital names
app.get("/hospitals", (req, res) => {
  db.query("SELECT hospital_name FROM hospitals", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// API endpoint to fetch insurer names

app.get("/insurer", (req, res) => {
  db.query("SELECT insurer_name FROM hospitals", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// API endpoint to fetch check eligibility

app.get("/api/eligibility", (req, res) => {
  const { hospital, insurer } = req.query;
  // Simulate eligibility rule
  const eligible = hospital && insurer && hospital.startsWith("A");
  res.json({ eligible });
});

//port
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
