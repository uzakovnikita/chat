const nodemailer = require('nodemailer');
const keys = require('../config/keys');
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport(
            { 
                host: keys.SMTP_HOST,
                port: keys.SMTP_PORT,
                secure: false,
                auth: {
                    user: keys.SMTP_USER,
                    pass: keys.SMTP_PASSWORD,
                }
            }
        )
    }
    async sendActiovationMail(to, link) {
        this.transporter.sendMail({
            from: keys.SMTP_USER,
            to,
            subject: `Активация аккаунта в чате гачимучи ${keys.API_URL}`,
            text: '',
            html: `
                <div>
                    <h1>
                        Для активации перейдите по ссылке
                    </h1>
                    <a href="${link}">ССЫЛ ОЧКА</a>
                </div>
            ` 
        })
    }

};

module.exports = new MailService();