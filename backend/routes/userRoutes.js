const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const Lobby = require('../models/Lobby'); // Import Lobby to clean up data
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

// Ensure this environment variable is set in .env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- NODEMAILER CONFIG ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  family: 4,     // Force IPv4
  logger: true,  // Log to console
  debug: true    // Include SMTP traffic
});

// --- HELPER: SEND CUSTOM BRANDED OTP EMAIL ---
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"ClanForge" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your ClanForge Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; }
          .container { max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #eeeeee; }
          .header { background-color: #2D2D2D; padding: 30px; text-align: center; }
          .logo { font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -1px; margin: 0; }
          .logo span { color: #FF6F00; }
          .content { padding: 40px 30px; text-align: center; color: #2D2D2D; }
          h2 { margin-top: 0; font-weight: 900; color: #2D2D2D; font-size: 22px; }
          .otp-box { background-color: #FFF3E0; border: 2px dashed #FF6F00; border-radius: 12px; display: inline-block; padding: 15px 40px; margin: 25px 0; }
          .otp-code { font-size: 36px; font-weight: 800; color: #FF6F00; letter-spacing: 6px; margin: 0; }
          .text-main { font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 0; }
          .text-sub { font-size: 14px; color: #999999; margin-top: 10px; }
          .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa; border-top: 1px solid #eeeeee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><div class="logo">Squad<span>Sync</span></div></div>
          <div class="content">
            <h2>Verify Your Email</h2>
            <p class="text-main">Welcome to the club! You are just one step away from joining your next squad. Use the code below to verify your account.</p>
            <div class="otp-box"><h1 class="otp-code">${otp}</h1></div>
            <p class="text-sub">This code is valid for 5 minutes.</p>
            <p class="text-sub" style="margin-top: 30px; font-size: 12px;">If you didn't request this email, you can safely ignore it.</p>
          </div>
          <div class="footer">&copy; ${new Date().getFullYear()} ClanForge. Connect. Collaborate. Create.<br>This is an automated message, please do not reply.</div>
        </div>
      </body>
      </html>
    `
  };
  await transporter.sendMail(mailOptions);
};

// 1. INITIATE REGISTRATION (Send OTP)
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email });
    await new OTP({ email, otp }).save();
    await sendOTPEmail(email, otp);

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error("OTP Error Details:", err);
    res.status(500).json({ msg: 'Failed to send OTP. Check server logs for details.', error: err.message });
  }
});

// 2. COMPLETE REGISTRATION (Verify OTP & Create User)
router.post('/register-verify', async (req, res) => {
  const { name, email, password, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    const uid = uuidv4();
    const newUser = new User({
      uid,
      name,
      email,
      password,
      avatarId: Math.floor(Math.random() * 8)
    });

    await newUser.save();
    await OTP.deleteMany({ email });
    res.json(newUser);
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: 'Registration failed' });
  }
});

// 3. LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
    if (!user.password) return res.status(400).json({ msg: 'Please sign in with Google' });
    if (user.password !== password) return res.status(400).json({ msg: 'Invalid Credentials' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 4. GOOGLE AUTH
router.post('/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      res.json(user);
    } else {
      const uid = uuidv4();
      user = new User({
        uid,
        name,
        email,
        password: '',
        avatarId: Math.floor(Math.random() * 8),
      });
      await user.save();
      res.json(user);
    }
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ msg: 'Google Authentication failed' });
  }
});

// 5. GET User Profile
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const publicProfile = {
      uid: user.uid,
      name: user.name,
      avatarId: user.avatarId,
      bio: user.bio,
      portfolio: user.portfolio || '',
      linkedin: user.linkedin || '',
      github: user.github || '',
      customLinks: Array.isArray(user.customLinks) ? user.customLinks : []
    };
    res.json(publicProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. UPDATE User Profile
router.post('/', async (req, res) => {
  const { uid, name, bio, phone, email, avatarId, portfolio, linkedin, github, customLinks } = req.body;
  try {
    let user = await User.findOne({ uid });
    if (user) {
      user.name = name;
      user.bio = bio;
      user.phone = phone;
      user.email = email;
      user.avatarId = avatarId;
      user.portfolio = portfolio;
      user.linkedin = linkedin;
      user.github = github;
      user.customLinks = Array.isArray(customLinks) ? customLinks : [];
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ msg: 'User not found to update' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. DELETE User (THIS WAS MISSING)
router.delete('/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const deletedUser = await User.findOneAndDelete({ uid });

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // CLEANUP: Remove lobbies hosted by this user
    await Lobby.deleteMany({ hostId: uid });

    // CLEANUP: Remove this user from other lobbies they joined
    await Lobby.updateMany(
      { "players.uid": uid },
      { $pull: { players: { uid: uid } } }
    );

    // Also remove any pending requests from this user
    await Lobby.updateMany(
      { "requests.uid": uid },
      { $pull: { requests: { uid: uid } } }
    );

    res.json({ msg: 'Account and associated data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;