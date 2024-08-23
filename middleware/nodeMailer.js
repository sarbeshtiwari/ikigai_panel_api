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
  const adminMailOptions = {
    from: 'sarbesh39tiwari@gmail.com',
    to: 'rahul8454454singh@gmail.com',
    subject: 'New User Query Received',
    text: `
      Dear Team,

      We have received a new query from a user. Below are the details:

      Name: ${name}
      Phone Number: ${phoneNumber}
      Email: ${email}

      Message:
      ${user_message}

      Best regards,
      Your Team
    `,
    html: `
      <p>Dear Team,</p>

      <p>We have received a new query from a user. Below are the details:</p>

      <table>
        <tr>
          <td><strong>Name:</strong></td>
          <td>${name}</td>
        </tr>
        <tr>
          <td><strong>Phone Number:</strong></td>
          <td>${phoneNumber}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>${email}</td>
        </tr>
        <tr>
          <td><strong>Message:</strong></td>
          <td>${user_message}</td>
        </tr>
      </table>

      <p>Best regards,<br>Your Team</p>
    `
  };

  const userMailOptions = {
    from: 'sarbesh39tiwari@gmail.com',
    to: email,
    subject: 'We Have Received Your Query',
    text: `
      Dear ${name},

      Thank you for reaching out to us. We have received your query and will get back to you as soon as possible.

      Here are the details of your query:
      
      Phone Number: ${phoneNumber}
      Email: ${email}

      Message:
      ${user_message}

      Best regards,
      Your Team
    `,
    html: `
      <p>Dear ${name},</p>

      <p>Thank you for reaching out to us. We have received your query and will get back to you as soon as possible.</p>

      <p>Here are the details of your query:</p>

      <table>
        <tr>
          <td><strong>Phone Number:</strong></td>
          <td>${phoneNumber}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>${email}</td>
        </tr>
        <tr>
          <td><strong>Message:</strong></td>
          <td>${user_message}</td>
        </tr>
      </table>

      <p>Best regards,<br>Your Team</p>
    `
  };

  try {
    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent successfully');
    
    // Send email to user
    await transporter.sendMail(userMailOptions);
    console.log('User email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};



const sendAppointmentEmail = async (name, phoneNumber, email) => {
  const adminMailOptions = {
      from: 'sarbesh39tiwari@gmail.com',
      to: 'rahul8454454singh@gmail.com',
      subject: 'New User Appointment Received',
      text: `
          Dear Team,

          We have received a new appointment request. Below are the details:

          Name: ${name}
          Phone Number: ${phoneNumber}
          Email: ${email}

          Best regards,
          Your Team
      `,
      html: `
          <p>Dear Team,</p>

          <p>We have received a new appointment request. Below are the details:</p>

          <table>
              <tr>
                  <td><strong>Name:</strong></td>
                  <td>${name}</td>
              </tr>
              <tr>
                  <td><strong>Phone Number:</strong></td>
                  <td>${phoneNumber}</td>
              </tr>
              <tr>
                  <td><strong>Email:</strong></td>
                  <td>${email}</td>
              </tr>
          </table>

          <p>Best regards,<br>Your Team</p>
      `
  };

  const userMailOptions = {
      from: 'sarbesh39tiwari@gmail.com',
      to: email,
      subject: 'Appointment Confirmation',
      text: `
          Dear ${name},

          Thank you for scheduling an appointment with us. We have received your appointment request and will get back to you with further details shortly.

          Here are the details of your appointment request:
          
          Phone Number: ${phoneNumber}
          Email: ${email}

          Best regards,
          Your Team
      `,
      html: `
          <p>Dear ${name},</p>

          <p>Thank you for scheduling an appointment with us. We have received your appointment request and will get back to you with further details shortly.</p>

          <p>Here are the details of your appointment request:</p>

          <table>
              <tr>
                  <td><strong>Phone Number:</strong></td>
                  <td>${phoneNumber}</td>
              </tr>
              <tr>
                  <td><strong>Email:</strong></td>
                  <td>${email}</td>
              </tr>
          </table>

          <p>Best regards,<br>Your Team</p>
      `
  };

  try {
      // Send email to admin
      await transporter.sendMail(adminMailOptions);
      console.log('Admin email sent successfully');
      
      // Send email to user
      await transporter.sendMail(userMailOptions);
      console.log('User email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
  }
};



  module.exports = {sendQueryEmail, sendAppointmentEmail};