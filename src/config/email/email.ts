import nodemailer from 'nodemailer';
import config from '..';

export const smtpTransport = nodemailer.createTransport({
    service: "Naver",
    host: 'smtp.naver.com',
    port: 465,
    auth: {
        user: config.naver.user,
        pass: config.naver.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});
