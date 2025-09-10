// server/mailer.js
const nodemailer = require("nodemailer");

async function getTransport() {
  // Se hai configurato SMTP in .env usa quello,
  // altrimenti crea automaticamente un account di test Ethereal.
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true", // true per 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    const test = await nodemailer.createTestAccount();
    console.log("Ethereal test account:", test.user, test.pass);
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: { user: test.user, pass: test.pass },
    });
  }
}

async function sendWelcomeEmail(to, name) {
  const transporter = await getTransport();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || "ConsulFast <no-reply@consulfast.local>",
    to,
    subject: "Benvenuto su ConsulFast",
    text: `Ciao ${name}, benvenut* su ConsulFast! Puoi accedere dalla tua Area Utenti.`,
    html: `<p>Ciao <b>${name}</b>,</p>
           <p>benvenut* su ConsulFast! L'account è attivo.</p>
           <p>Vai alla tua <a href="https://tuodominio.it/area-utenti">Area Utenti</a>.</p>`,
  });

  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) {
    console.log("Anteprima email (solo Ethereal):", preview);
  }
}

module.exports = { sendWelcomeEmail };
