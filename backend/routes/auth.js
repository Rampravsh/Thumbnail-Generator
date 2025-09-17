const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register
router.post("/register", authController.register);
// Verify OTP
router.post("/verify-otp", authController.verifyOTP);
// Login
router.post("/login", authController.login);
// Google Login (client-side ID token verification)
router.post("/google-login", authController.googleLogin);

const passport = require("passport");
const jwt = require("jsonwebtoken");

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login", // Redirect to frontend login page on failure
    session: false, // We are using tokens, so no session is needed
  }),
  (req, res) => {
    // Successful authentication, generate a token and redirect
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // Redirect to a frontend route that can handle the token (e.g., save it in local storage)
    res.redirect(`http://localhost:5000/auth/google/callback?token=${token}`);
  }
);

module.exports = router;
