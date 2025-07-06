import nodemailer from 'nodemailer';
import { EMAIL_PASSWORDS } from './env.js';

export const accountEmail = 'harklit25@gmail.com'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    user: accountEmail,
    pass: EMAIL_PASSWORDS
})

export default transporter;