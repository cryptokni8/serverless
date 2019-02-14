require("dotenv").config();
const nodemailer = require('nodemailer');

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASSWORD;

exports.handler = function(event, context, callback) {
  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });

    const { data } = JSON.parse(event.body);

    if (!data || !data.email) {
        console.error('Required information is missing');

        return callback(null, {
            statusCode: 400,
            body: 'Email details incomplete',
        });
    }

    const mailOptions = {
        from: data.email,
        to: user,
        subject: 'Portfolio enquiry',
        text: data.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    error: error.message,
                }),
            });
        }

        return callback(null, {
            statusCode: 200,
            body: 'Email sent',
        });
    });
}
