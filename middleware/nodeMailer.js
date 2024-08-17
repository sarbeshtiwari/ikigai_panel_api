const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sarbesh39tiwari@gmail.com',
    pass: 'osxpialbinrjkhht'
  }
});


const sendQueryEmail = async (name, phoneNumber, email, user_message) => {
    const mailOptions = {
      from: 'sarbesh39tiwari@gmail.com',
      to: 'rahul8454454singh@gmail.com',
      subject: 'New User Query Received',
      text: `
        A new query has been received:
        \nName: ${name}
        \nPhone Number: ${phoneNumber}
        \nEmail: ${email}
        \nMessage: ${user_message}
      `,
      html: `
        <p>A new query has been received:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Phone Number:</strong> ${phoneNumber}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Message:</strong> ${user_message}</li>
        </ul>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const sendAppointmentEmail = async (name, phoneNumber, email) => {
    const mailOptions = {
      from: 'sarbesh39tiwari@gmail.com',
      to: 'rahul8454454singh@gmail.com',
      subject: 'New User Appointment Received',
      text: `
        A new Appointment has been received:
        \nName: ${name}
        \nPhone Number: ${phoneNumber}
        \nEmail: ${email}
      `,
      html: `
        <p>A new Appointment has been received:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Phone Number:</strong> ${phoneNumber}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


  module.exports = {sendQueryEmail, sendAppointmentEmail};