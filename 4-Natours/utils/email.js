// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
const nodemailer = require('nodemailer');
const pug = require('pug');
// eslint-disable-next-line import/no-extraneous-dependencies
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.url = url;
        this.to = user.email;
        this.from = `Andv170 <${process.env.EMAIL_FROM}>`;
        this.firstName = user.name.split(' ')[0];
    }

    createNewTransport() {
        if (process.env.NODE_ENV === 'production') {
            //SendGrid
            return 1;
        }
        //1) Create transporter
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(template, subject) {
        //1) Render pugtemplate base on template vari
        const filePath = path.join(
            __dirname,
            '..',
            'views',
            'emails',
            `${template}.pug`,
        );
        const html = pug.renderFile(filePath, {
            firstName: this.firstName,
            url: this.url,
            subject,
        });
        //2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html),
        };
        //3) Create transport and send email
        await this.createNewTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family !!');
    }

    async sendResetPassword() {
        await this.send(
            'passwordReset',
            'Your password reset valid only for 10 minutes',
        );
    }
};
