import Promise from 'bluebird';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import nodemailer from 'nodemailer';
import config from '../../config/env';

const transporter = nodemailer.createTransport(`smtps://${config.mailer.user}:${config.mailer.pass}@${config.mailer.host}`);

function send(toEmail, subject, body) {
    var emailData = {
        from: config.mailer.defaultFromAddress,
        to: toEmail,
        subject: subject,
        bcc: config.mailer.defaultBcc,
        text: body
    }

    return transporter.sendMail(emailData)
}

function sendPasswordResetEmail(user, accessToken) {
    const subject = `⚽️🏆 ${user.firstName}, on a oublié son mot de passe ?`
    const body = `Il suffit de cliquer sur ce lien pour le récupérer : ${config.webUrl}/recover/${accessToken}`;
    return send(user.email, subject, body);
}

export default { send, sendPasswordResetEmail };