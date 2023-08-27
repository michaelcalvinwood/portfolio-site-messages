const listenPort = 6200;
const hostname = 'michaelcalvinwood.net'
const privateKeyPath = `/etc/letsencrypt/live/${hostname}/privkey.pem`;
const fullchainPath = `/etc/letsencrypt/live/${hostname}/fullchain.pem`;

const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');

const mailgun = require('./utils/mailGun');

const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
var corsOptions = {
    origin: 'https://michaelcalvinwood.net',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const handleMessage = async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) res.status(400).json('bad request');

    const html = `Name: ${name}<br /><br />Email: ${email}<br><br>Message:<br />${message}`;
    mailgun.sendEmailViaMailGun('michaelwood33311@icloud.com', 'admin@treepadcloud.com', 'Portfolio Site Message', html, 'TreePad Cloud');
    return res.status(200).json('ok');
}

app.post('/message', (req, res) => handleMessage(req, res));

const httpsServer = https.createServer({
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullchainPath),
  }, app);
  

  httpsServer.listen(listenPort, '0.0.0.0', () => {
    console.log(`HTTPS Server running on port ${listenPort}`);
});

