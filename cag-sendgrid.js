const path = require('path');
const tl = require('vso-task-lib');
const fs = require('fs');
const sendgrid = require('@sendgrid/mail');

const sendgridkey = tl.getInput('sendgridkey', true);
const to = tl.getInput('to', true);
const from = tl.getInput('from', true);
const subject = tl.getInput('subject', true);
const htmlbody = tl.getInput('htmlbody', true);
const addattachment = tl.getBoolInput('addattachment', true);
const attachment = tl.getPathInput('attachment', false);

console.log(
`
=============
Mail Settings
=============
To Address: ${to}
From Adddress: ${from}
Subject: ${subject}
Body: ${htmlbody}
Attachment included? ${addattachment}
Attachment: ${attachment}
`
);

sendgrid.setApiKey(sendgridkey);

let msg = {
    to: to.replace(/ /g , '').split(','),
    from: from,
    subject: subject,
    html: htmlbody
};

try {
    if(addattachment) { 
        tl.checkPath(attachment, 'attachment');
        const fileBase64 = fs.readFileSync(attachment).toString('base64');

        msg.attachments = 
        [
            {
                content: fileBase64,
                filename: path.basename(attachment),
                contentId: path.basename(attachment, path.extname(attachment))
            }
        ]
    }

    sendgrid.send(msg);
      
} catch (error) {
    console.log(error);    
    tl.exit(1);
}