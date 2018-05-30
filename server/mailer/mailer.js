import Promise from 'bluebird';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import nodemailer from 'nodemailer';
import config from '../../config/env';
import _ from 'lodash';

const transporter = nodemailer.createTransport(`smtps://${config.mailer.user}:${config.mailer.pass}@${config.mailer.host}`);

function send(toEmail, subject, body) {
    var emailData = {
        from: config.mailer.defaultFromAddress,
        to: toEmail,
        subject: config.mailer.prefix + subject,
        bcc: config.mailer.defaultBcc,
        text: body
    }

    return transporter.sendMail(emailData)
}

function notifyAll(event, data) {
    let formattedData = `There is a new ${event} event on ${config.mailer.prefix} Lotofoot \n`;
    formattedData += '\n \n ##################### \n';
    _.map(data, (value, key) => {
        formattedData += `${key} : ${value} \n`;
    });
    formattedData += '\n ##################### \n \n';
    const emailData = {
        from: config.mailer.defaultFromAddress,
        to: config.mailer.defaultBcc,
        subject: `${config.mailer.prefix} New ${event} created !`,
        text: formattedData.toString()
    }
    console.log("emailData", emailData);
    return transporter.sendMail(emailData)
        .then(() => {
            console.log("Email Sent");
        }, (e) => {
            console.log("Fail to send email", e);

        });
}

function sendPasswordResetEmail(user, accessToken) {
    const subject = `⚽️🏆 ${user.firstName}, on a oublié son mot de passe ?`
    const body = `Il suffit de cliquer sur ce lien pour le récupérer : ${config.webUrl}/recover/${accessToken}`;
    return send(user.email, subject, body);
}

function sendConfirmationEmail(user, validationToken) {
    const subject = `⚽️🏆 ${user.firstName}, please validate your email`
    const body = `You just need to click here to validate your email : ${config.apiUrl}/validation?token=${validationToken}&email=${user.email}`;
    return send(user.email, subject, body);
}

export default { send, sendPasswordResetEmail, sendConfirmationEmail, notifyAll };