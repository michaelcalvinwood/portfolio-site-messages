require('dotenv').config();

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);

const { MAIL_GUN_API_KEY } = process.env;
console.log(MAIL_GUN_API_KEY);

const client = mailgun.client({username: 'api', key: MAIL_GUN_API_KEY});

 
 exports.sendEmailViaMailGun = async (email, sender, subject, message, senderName) => {

    const messageData = {
      from: `${senderName} <${sender}>`,
      to: email,
      subject,
      html: message
    };
    
    let result = null;

    try {
      result = await client.messages.create("treepadcloud.com", messageData);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
 }

 //exports.sendEmailViaMailGun ('michaelwood33311@icloud.com', 'admin@treepadcloud.com', 'Test Message', 'Checking API', 'TreePad Cloud');