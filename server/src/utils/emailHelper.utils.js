const nodemailer = require("nodemailer");

module.exports = {
  sendOTPEmail: async (toEmail, otp) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "Taskify",
      to: toEmail,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    return info;
  },
  sendTaskAssignEmail: async (toEmail, name) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "Taskify",
      to: toEmail,
      subject: "New Task Assigned",
      html: `<p>Hey there, you've been assigned a new task: <strong>${name}</strong></p>`,
    });

    return info;
  },
};
