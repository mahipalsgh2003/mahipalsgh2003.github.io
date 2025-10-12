const express = require("express");
const bodyParser = require("body-parser");
const { totp } = require("otplib");
const path = require("path");

const app = express();
const PORT = 3000;

const SECRET = "JBSWY3DPEHPK3PXP"; // must match Google Authenticator
const ADMIN_USERNAME = "dev";

totp.options = { digits: 6, step: 30, window: 1 };

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post("/verify-otp", (req, res) => {
  const { username, otp } = req.body;
  console.log("Received:", username, otp);
  console.log("Server expects OTP:", totp.generate(SECRET));

  if (username !== ADMIN_USERNAME) return res.status(401).json({ success: false, message: "Invalid username" });

  const isValid = totp.check(otp, SECRET);
  console.log("OTP valid?", isValid);

  if (isValid) res.json({ success: true });
  else res.status(401).json({ success: false, message: "Invalid OTP" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
