const fs = require('fs');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const apiKeysContent = fs.readFileSync('apikeys.json', 'utf-8');
const apiKeys = JSON.parse(apiKeysContent);

//! MODIFY THESE FIELDS:

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
} = apiKeys.googleMailAuth;

const senderAddress = "";
const recipientAddresses = [""]; // Add more email addresses as needed

//! ///////////////////////////////////////////////////

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: senderAddress,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Generate the Wi-Fi code
    const wifiCode = wifi();

    // Modify mailOptions to include the generated Wi-Fi code
    const mailOptions = {
      from: `Mail Service <${senderAddress}>`,
      bcc: recipientAddresses.join(", "), // Use BCC to hide recipients from each other
      subject: "Wifi Code",
      text: `Your Wi-Fi Code is: ${wifiCode}`,
      html: `<p>Your Wi-Fi Code is:</p><h1>${wifiCode}</h1>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

function excelDate(date1) {
  const temp = new Date(1899, 11, 30); // Note: JavaScript months are 0-indexed
  const delta = (date1 - temp) / (1000 * 60 * 60 * 24);
  return Math.floor(delta);
}

function wifi() {
  const base = Math.floor(excelDate(new Date()));
  return Math.floor((base + 2415019) / new Date().getDate());
}

// Schedule the task to run every day at 7:00 AM
cron.schedule('10 12 * * *', async () => {
  try {
    const result = await sendMail();
    console.log("Email sent...", result);
  } catch (error) {
    console.log(error.message);
  }
});
