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
        IKIGAI Wellness
                      HS-11, Kailash Colony Market,
                      Greater Kailash-1, Kailash Colony, 
                      Greater Kailash,
                      New Delhi-110048
                      Phone: +91 7678483376, +91 9625089470
            `,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <title>New User Query Received</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  box-sizing: border-box;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  background-color: #ffffff;
              }
              .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-bottom: 20px;
              }
              .header img {
                  max-width: 150px;
              }
              .header .company-info {
                  text-align: right;
              }
              .banner {
                  width: 100%;
                  height: auto;
                  margin-bottom: 20px;
              }
              .content {
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  background-color: #f9f9f9;
              }
              table {
                  width: 100%;
                  border: 1px solid black;
                  border-collapse: collapse;
              }
              table td {
                  border: 1px solid black;
                  padding: 8px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <!-- Header -->
              <div class="header">
                  <img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724322699/uploads/testimonials/logo.png.png" style="max-width: 120px; alt="Company Logo">
                  <div class="company-info">
                      <strong>IKIGAI Wellness</strong><br>
                      HS-11, Kailash Colony Market,<br> 
                      Greater Kailash-1, Kailash Colony,<br> 
                      Greater Kailash, <br>
                      New Delhi-110048 <br>
                      Phone: +91 7678483376, +91 9625089470
                  </div>
              </div>
              <!-- Banner -->
              <img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724129940/uploads/our_specialities/tailored-solutions.jpg.jpg" alt="Banner Image" class="banner">
              <!-- Main Content -->
              <div class="content">
                  <strong>Dear Team,</strong>
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
                  <p>Best regards,<br><img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724322699/uploads/testimonials/logo.png.png" alt="Signature Image" style="max-width: 120px;"></p>
              </div>
          </div>
      </body>
      </html>
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
    IKIGAI Wellness
                      HS-11, Kailash Colony Market,
                      Greater Kailash-1, Kailash Colony, 
                      Greater Kailash,
                      New Delhi-110048
                      Phone: +91 7678483376, +91 9625089470
        `,
        html: `
    <!DOCTYPE html>
    <html>
    <head>
        <title>We Have Received Your Query</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #ffffff;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 20px;
            }
            .header img {
                max-width: 150px;
            }
            .header .company-info {
                text-align: right;
            }
            .banner {
                width: 100%;
                height: auto;
                margin-bottom: 20px;
            }
            .content {
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            table {
                width: 100%;
                border: 1px solid black;
                border-collapse: collapse;
            }
            table td {
                border: 1px solid black;
                padding: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                  <img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724322699/uploads/testimonials/logo.png.png" style="max-width: 120px; alt="Company Logo">
                  <div class="company-info">
                      <strong>IKIGAI Wellness</strong><br>
                      HS-11, Kailash Colony Market,<br> 
                      Greater Kailash-1, Kailash Colony,<br> 
                      Greater Kailash, <br>
                      New Delhi-110048 <br>
                      Phone: +91 7678483376, +91 9625089470
                  </div>
              </div>
            <!-- Banner -->
            <img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724129940/uploads/our_specialities/tailored-solutions.jpg.jpg" alt="Banner Image" class="banner">
            <!-- Main Content -->
            <div class="content">
                <p>Dear <strong>${name}</strong>,</p>
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
                <p>Best regards,<br><img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724322699/uploads/testimonials/logo.png.png" alt="Signature Image" style="max-width: 120px;"></p>
            </div>
        </div>
    </body>
    </html>
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
IKIGAI Wellness
HS-11, Kailash Colony Market,
Greater Kailash-1, Kailash Colony,
Greater Kailash,
New Delhi-110048
Phone: +91 7678483376, +91 9625089470
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
    <title>New User Appointment Received</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #ffffff;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 150px;
        }
        .header .company-info {
            text-align: right;
        }
        .banner {
            width: 100%;
            height: auto;
            margin-bottom: 20px;
        }
        .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        table {
            width: 100%;
            border: 1px solid black;
            border-collapse: collapse;
        }
        table td {
            border: 1px solid black;
            padding: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724322699/uploads/testimonials/logo.png.png" style="max-width: 120px; alt="Company Logo">
            <div class="company-info">
                <strong>IKIGAI Wellness</strong><br>
                HS-11, Kailash Colony Market,<br>
                Greater Kailash-1, Kailash Colony,<br>
                Greater Kailash,<br>
                New Delhi-110048<br>
                Phone: +91 7678483376, +91 9625089470
            </div>
        </div>
        <!-- Banner -->
        <img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724129940/uploads/our_specialities/tailored-solutions.jpg.jpg" alt="Banner Image" class="banner">
        <!-- Main Content -->
        <div class="content">
            <p><strong>Dear Team,</strong></p>
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
            <p>Best regards,<br><img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724322699/uploads/testimonials/logo.png.png" alt="Signature Image" style="max-width: 120px;"></p>
        </div>
    </div>
</body>
</html>
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
IKIGAI Wellness
HS-11, Kailash Colony Market,
Greater Kailash-1, Kailash Colony,
Greater Kailash,
New Delhi-110048
Phone: +91 7678483376, +91 9625089470
  `,
  html: `
<!DOCTYPE html>
<html>
<head>
  <title>Appointment Confirmation</title>
  <style>
      body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
      }
      .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #ffffff;
      }
      .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
      }
      .header img {
          max-width: 150px;
      }
      .header .company-info {
          text-align: right;
      }
      .banner {
          width: 100%;
          height: auto;
          margin-bottom: 20px;
      }
      .content {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
      }
      table {
          width: 100%;
          border: 1px solid black;
          border-collapse: collapse;
      }
      table td {
          border: 1px solid black;
          padding: 8px;
      }
  </style>
</head>
<body>
  <div class="container">
      <!-- Header -->
      <div class="header">
          <img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724322699/uploads/testimonials/logo.png.png" style="max-width: 120px; alt="Company Logo">
          <div class="company-info">
              <strong>IKIGAI Wellness</strong><br>
              HS-11, Kailash Colony Market,<br>
              Greater Kailash-1, Kailash Colony,<br>
              Greater Kailash,<br>
              New Delhi-110048<br>
              Phone: +91 7678483376, +91 9625089470
          </div>
      </div>
      <!-- Banner -->
      <img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724129940/uploads/our_specialities/tailored-solutions.jpg.jpg" alt="Banner Image" class="banner">
      <!-- Main Content -->
      <div class="content">
          <p>Dear <strong>${name}</strong>,</p>
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
          <p>Best regards,<br><img src="https://res.cloudinary.com/dmf5snnz9/image/upload/v1724322699/uploads/testimonials/logo.png.png" alt="Signature Image" style="max-width: 120px;"></p>
      </div>
  </div>
</body>
</html>
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