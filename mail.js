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

const senderAddress = "email1@gmail.com";
const recipientAddresses = ["email2@gmail.com", "email3@gmail.com"]; // Add more email addresses as needed

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


    // Modify mailOptions to include the generated Wi-Fi code
    const mailOptions = {
      from: `Mail Service <${senderAddress}>`,
      bcc: recipientAddresses.join(", "), // Use BCC to hide recipients from each other
      subject: "Subject",
      text: `Message`,
      html: `<p>Message</p><h1>Haiii</h1>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
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
