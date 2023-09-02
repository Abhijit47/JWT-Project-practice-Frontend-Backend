const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { successResponse, errorResponse } = require('../utils/utilities');
dotenv.config({ path: './config.env', encoding: 'utf8', debug: false, override: false });

exports.sendResetpasswordMail = async (name, email, token) => {
  try {
    // create a transporter for sending mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.email,
        pass: process.env.email_access
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // define some mail options
    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "Reset Password",
      html: `
      <p>
        Hi, ${name},Please copy the link  
          <a href="http://localhost:9999/api/v1/resetpassword/${token}"target=_blank>
            click here
          </a>  
            and reset your password
      </p>
      `
    };

    // using transporter sendmail fn to send a email to user
    transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
        console.log(err.message, err.name, err.stack);
        return;
      }

      // successResponse(res, "Message sent successfully", 200);
      console.log("Message sent successfully");

      // close the transporter connection after sending mail
      transporter.close();
    });

  } catch (err) {
    // errorResponse(res)
    console.log(err.message);
  }
};