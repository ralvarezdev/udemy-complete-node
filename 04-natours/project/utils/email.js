import nodemailer from 'nodemailer';

const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailUsername = process.env.EMAIL_USERNAME;
const emailPassword = process.env.EMAIL_PASSWORD;

// console.log(emailHost, emailPort, emailUsername, emailPassword);

export const sendEmail = async ({ email, subject, message }) => {
  //  Create a transporter
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    logger: false,
    auth: {
      user: emailUsername,
      pass: emailPassword
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'Natours <natours@ralvarezdev.io>',
    to: email,
    subject,
    text: message
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};