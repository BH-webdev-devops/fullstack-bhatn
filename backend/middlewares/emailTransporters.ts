import nodemailer from 'nodemailer';

export const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dev.cyth@gmail.com',
    pass:"uaro vjlt migi ltpx"
    }
});