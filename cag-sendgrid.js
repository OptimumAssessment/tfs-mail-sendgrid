const path = require('path');
const urix = require('urix');
const task = require('azure-pipelines-task-lib/task');
const fs = require('fs');
const sendgrid = require('@sendgrid/mail');

const sendgridkey = task.getInput('sendgridkey', true);
const to = task.getInput('to', true);
const cc = task.getInput('cc', false);
const from = task.getInput('from', true);
const subject = task.getInput('subject', true);
const htmlbody = task.getInput('htmlbody', true);
const addattachment = task.getBoolInput('addattachment', true);
let attachment = task.getPathInput('attachment', false);

if (process.platform === 'win32') attachment = urix(attachment);

console.log(
`
=============
Mail Settings
=============
To Address: ${to}
Cc Adddress: ${cc}
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

if(cc) {
    msg.cc = cc.replace(/ /g , '').split(',') 
}

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
    task.setResult(Failed);
}
