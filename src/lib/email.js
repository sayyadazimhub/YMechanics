// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY || 're_Fr76owGK_F7xqxUbLFCbt94ps2T6CfoiR');

// resend.emails.send({
//   from: 'onboarding@resend.dev', // Testing domain provided by Resend
//   to: 'azimsayyad90@gmail.com', //
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (to, otp, name) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev', // Use env variable or fallback
      to,
      subject: "Verify Your Account - OTP",

      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Hello ${name}</h2>
          <p>Your verification code is:</p>

          <h1 style="color:#2563eb">${otp}</h1>

          <p>This OTP is valid for 5 minutes.</p>

          <p>Do not share this with anyone.</p>
        </div>
      `
    });

    return data;

  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};


// export const sendResetPasswordEmail = async (to, name, resetLink) => {
//   try {

//     const data = await resend.emails.send({

//       from: process.env.FROM_EMAIL || 'onboarding@resend.dev',

//       to,

//       subject: "Reset Your Password",

//       html: `
//         <div style="font-family:Arial;padding:20px">

//           <h2>Hello ${name}</h2>

//           <p>You requested to reset your password.</p>

//           <p>Click the button below:</p>

//           <a 
//             href="${resetLink}"
//             style="
//               display:inline-block;
//               padding:12px 20px;
//               background:#2563eb;
//               color:white;
//               text-decoration:none;
//               border-radius:6px;
//               margin:15px 0;
//             "
//           >
//             Reset Password
//           </a>

//           <p>This link is valid for 1 hour.</p>

//           <p>If you did not request this, ignore this email.</p>

//         </div>
//       `
//     });

//     return data;

//   } catch (error) {

//     console.error("Reset Email Error:", error);

//     throw error;
//   }
// };

export const sendResetPasswordEmail = async (to, otp, name) => {
  try {

    const data = await resend.emails.send({

      from: process.env.FROM_EMAIL || "onboarding@resend.dev",

      to,

      subject: "Reset Your Password - OTP Verification",

      html: `
        <div style="font-family:Arial;padding:20px">
          
          <h2>Hello ${name},</h2>

          <p>You requested to reset your password.</p>

          <p>Your reset code is:</p>

          <h1 style="color:#dc2626">${otp}</h1>

          <p>This OTP is valid for <b>5 minutes</b>.</p>

          <p>If you did not request this, please ignore this email.</p>

          <br/>

          <p style="font-size:14px;color:#555">
            — Mechanic Support Team
          </p>

        </div>
      `,

    });

    return data;

  } catch (error) {

    console.error("Reset Email Error:", error);

    throw error;

  }
};