const { google } = require('googleapis');
const readline = require('readline');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Load .env from backend root

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env');
    process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ['https://mail.google.com/'];

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // Crucial for getting a Refresh Token
        scope: SCOPES,
        prompt: 'consent' // Force consent screen to ensure refresh token is returned
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);

            console.log('\n✅ Authorization successful!');
            console.log('Copy this REFRESH_TOKEN to your .env file:\n');
            console.log(`REFRESH_TOKEN=${token.refresh_token}`);
            console.log('\n(If it says undefined, you might have already authorized it. Go to your Google Account > Security > Third party apps, disconnect this app, and try again.)');
        });
    });
}

getAccessToken(oAuth2Client);
