const fs = require('fs');
 
fs.readFile('D:/code/apikeys.txt', (err, data) => {
    if (err) throw err;
 
    console.log(data.toString());
})

const nodeMailer = require('nodemailer');

const html = `
    <h1>Hello World</h1>
    <p>Nodemailer message</p>
`;

async function main() {

    nodeMailer.createTransport({
        host: "mail.openjavascript.info",
        port: 465,
        secure: true,
        auth: {
            user: "open.jscode@gmail.com",
            pass: "a"
        }

    });

}


main();