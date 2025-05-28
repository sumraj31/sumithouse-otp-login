const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// In-memory OTP store for demo
const otpStore = {};

app.post("/api/send-otp", (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;
  console.log(`OTP for ${phone}: ${otp}`);

  // Here you would integrate SMS API like Twilio to send OTP
  res.json({ message: "OTP sent (simulated)" });
});

app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP are required" });

  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone];
    res.json({ message: "OTP verified. Welcome to Sumithouse!" });
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// Serve React build
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
