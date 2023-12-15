const fs = require('fs');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const apiKeysContent = fs.readFileSync('D:/code/apikeys.json', 'utf-8');
const apiKeys = JSON.parse(apiKeysContent);

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
} = apiKeys.googleMailAuth;

const oAtuh2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

oAtuh2Client.setCredentials({refresh_token: REFRESH_TOKEN})

async function sendMail() {

    try {
        const accessToken = await oAtuh2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "open.jscode@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            },
        })

        const mailOptions = {
            from: "Mail Service <open.jscode@gmail.com>",
            to: "peter.rapcsak@gmail.com",
            subject: "Hello from gmail using API",
            text: "hello hello csao",
            html: "<h1>hello hello csao</h1>",
        };

        const result = await transport.sendMail(mailOptions)
        return result

    } catch (error) {
        return error
    }
}

sendMail()
    .then((result) => console.log("Email sent...", result))
    .catch((error) => console.log(error.message));