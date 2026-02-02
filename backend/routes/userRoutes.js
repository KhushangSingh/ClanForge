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

const { google } = require('googleapis');

// --- GMAIL API CONFIG (HTTP) ---
// This bypasses SMTP ports (465/587) which are blocked by Render.
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URI, not used for server-to-server but required
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// --- HELPER: SEND EMAIL VIA GMAIL REST API ---
const sendOTPEmail = async (email, otp) => {
  const subject = 'Your ClanForge Verification Code';
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

  const messageParts = [
    `From: ClanForge <${process.env.EMAIL_USER}>`,
    `To: ${email}`,
    `Subject: ${utf8Subject}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;900&family=Inter:wght@400;600&display=swap');
          body { margin: 0; padding: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #1a1a1a; color: #e0e0e0; }
          .container { 
            max-width: 480px; 
            margin: 40px auto; 
            background: #252525; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.5); 
            border: 1px solid #333333; 
          }
          .header { 
            background: linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%); 
            padding: 30px; 
            text-align: center; 
          }
          .logo { 
            font-family: 'Orbitron', sans-serif; 
            font-size: 28px; 
            font-weight: 900; 
            color: #ffffff; 
            text-transform: uppercase; 
            letter-spacing: 2px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .content { padding: 40px 30px; text-align: center; }
          h2 { 
            margin-top: 0; 
            font-weight: 600; 
            color: #ffffff; 
            font-size: 20px; 
            margin-bottom: 10px;
          }
          .text-main { 
            font-size: 15px; 
            line-height: 1.6; 
            color: #b0b0b0; 
            margin-bottom: 25px; 
          }
          .otp-box { 
            background-color: rgba(255, 111, 0, 0.1); 
            border: 1px solid #FF6F00; 
            border-radius: 12px; 
            display: inline-block; 
            padding: 10px 30px; 
            margin-bottom: 25px;
            box-shadow: 0 0 15px rgba(255, 111, 0, 0.2);
          }
          .otp-code { 
            font-family: 'Orbitron', monospace; 
            font-size: 32px; 
            font-weight: 700; 
            color: #FF6F00; 
            letter-spacing: 4px; 
            margin: 0; 
          }
          .text-sub { font-size: 13px; color: #666666; margin-top: 20px; }
          .footer { 
            background-color: #1f1f1f; 
            padding: 20px; 
            text-align: center; 
            font-size: 11px; 
            color: #555555; 
            border-top: 1px solid #333333; 
          }
          .divider { height: 1px; background: #333333; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CLANFORGE</div>
          </div>
          <div class="content">
            <h2>Authentication Required</h2>
            <p class="text-main">
              You are accessing your ClanForge secure account. 
              <br>Enter the code below to verify your identity.
            </p>
            
            <div class="otp-box">
              <h1 class="otp-code">${otp}</h1>
            </div>

            <div class="divider"></div>
            
            <p class="text-sub">
              This code expires in 5 minutes.
              <br>If you did not request this, please ignore this email.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} ClanForge. All Systems Operational.
            <br>Automated Security Message.
          </div>
        </div>
      </body>
      </html>
    `
  ];

  const message = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage
    }
  });
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

    res.json({ msg: 'OTP sent to email (via HTTP API)' });
  } catch (err) {
    console.error("Gmail API Error:", err);
    res.status(500).json({ msg: 'Failed to send OTP.', error: err.message, stack: err.stack });
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