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

  if (!hospital || !insurer) {
    return res.status(400).json({ message: "Missing hospital or insurer" });
  }

  const query = `
    SELECT cashless 
    FROM hospitals 
    WHERE LOWER(hospital_name) = LOWER(?) 
      AND LOWER(insurer_name) = LOWER(?) 
    LIMIT 1
  `;

  db.query(query, [hospital, insurer], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ eligible: false, message: "No matching record found" });
    }

    const record = results[0];
    if (record.cashless === 1) {
      return res.json({ eligible: true, message: "Eligible for cashless treatment" });
    } else {
      return res.json({ eligible: false, message: "Not eligible for cashless treatment" });
    }
  });
});



//port
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
