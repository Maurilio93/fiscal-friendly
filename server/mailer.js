const nodemailer = require("nodemailer");

async function getTransport() {
  try {
    if (process.env.SMTP_HOST) {
      const host   = process.env.SMTP_HOST;
      const port   = Number(process.env.SMTP_PORT || 587);
      const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
      const user   = process.env.SMTP_USER;
      const pass   = process.env.SMTP_PASS;

      if (!user || !pass) {
        console.warn("[MAILER] SMTP_HOST presente ma manca SMTP_USER o SMTP_PASS: disabilito invio.");
        return null;
      }

      // Opzioni TLS conservative (STARTTLS su 587 o SSL su 465)
      const transport = nodemailer.createTransport({
        host, port, secure,
        auth: { user, pass },
        tls: {
          // molti provider richiedono almeno TLS 1.2
          minVersion: "TLSv1.2",
          // se il certificato è self-signed lato hosting, sblocca la verifica:
          // ATTENZIONE: tienilo false se hai un cert valido
          rejectUnauthorized: true
        }
      });

      return transport;
    }

    // fallback test in non-prod
    if (process.env.NODE_ENV !== "production") {
      try {
        const test = await nodemailer.createTestAccount();
        console.log("[MAILER] Ethereal test account:", test.user, test.pass);
        return nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          auth: { user: test.user, pass: test.pass },
        });
      } catch (e) {
        console.warn("[MAILER] Ethereal non disponibile:", e.message);
        return null;
      }
    }

    console.warn("[MAILER] SMTP non configurato (prod): email disabilitata.");
    return null;
  } catch (e) {
    console.error("[MAILER] getTransport error:", e);
    return null;
  }
}

async function verifySmtp() {
  const transporter = await getTransport();
  if (!transporter) return { ok: false, reason: "no-transport" };
  try {
    const r = await transporter.verify();
    // nodemailer ritorna true o un oggetto; entrambi ok
    return { ok: true, details: r === true ? "verified" : r };
  } catch (e) {
    console.error("[MAILER] verify() failed:", e && (e.stack || e.message || e));
    return { ok: false, reason: e && e.message, code: e && e.code };
  }
}

async function sendRaw({ to, subject, html, text }) {
  const transporter = await getTransport();
  if (!transporter) return { sent: false, reason: "no-transport" };

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `MiniConsulenze <${process.env.SMTP_USER || "no-reply@miniconsulenze.it"}>`,
      to,
      subject,
      text: text || html?.replace(/<[^>]+>/g, ""),
      html,
    });

    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log("[MAILER] Anteprima (Ethereal):", preview);
    return { sent: true, messageId: info.messageId, preview };
  } catch (e) {
    console.error("[MAILER] sendRaw error:", e && (e.stack || e.message || e));
    return { sent: false, reason: e && e.message, code: e && e.code, error: String(e) };
  }
}

/* ---------------------- TEMPLATES ---------------------- */

async function sendWelcomeEmail(to, name) {
  try {
    return await sendRaw({
      to,
      subject: "Benvenuto su MiniConsulenze",
      html: `<p>Ciao <b>${name}</b>, benvenut* su MiniConsulenze!</p>`,
      text: `Ciao ${name}, benvenut* su MiniConsulenze!`,
    });
  } catch (e) {
    console.error("[MAILER] sendWelcomeEmail error:", e);
    return { sent: false, reason: e.message };
  }
}

async function notifyAdminNewRegistration(email, name) {
  const admins = (process.env.ADMIN_EMAILS || process.env.SMTP_USER || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  if (!admins.length) return { sent: false, reason: "no-admin-emails" };

  return sendRaw({
    to: admins.join(","),
    subject: "Nuova registrazione",
    html: `<p>Nuovo utente registrato: <b>${email}</b>${name ? " (" + name + ")" : ""}</p>`,
  });
}

async function sendPaymentConfirmationToUser(to, orderCode, totalEuro) {
  return sendRaw({
    to,
    subject: "Pagamento ricevuto",
    html: `<h2>Grazie!</h2><p>Pagamento confermato per ordine <b>${orderCode}</b>.<br>Totale: € ${Number(totalEuro/100).toFixed(2)}</p>`,
  });
}

async function notifyAdminPayment(email, orderCode, totalEuro) {
  const admins = (process.env.ADMIN_EMAILS || process.env.SMTP_USER || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  if (!admins.length) return { sent: false, reason: "no-admin-emails" };

  return sendRaw({
    to: admins.join(","),
    subject: "Nuovo pagamento",
    html: `<p>Utente: <b>${email || "-"}</b><br>Ordine: <b>${orderCode}</b><br>Totale: € ${Number((totalEuro||0)/100).toFixed(2)}</p>`,
  });
}

async function sendPasswordResetEmail(to, link, name) {
  return sendRaw({
    to,
    subject: "Reset della password",
    html: `<p>Ciao ${name ? `<b>${name}</b>` : ""}, per reimpostare la password clicca 
           <a href="${link}">qui</a>. Il link scade tra 30 minuti.</p>`,
  });
}

module.exports = {
  getTransport,        // solo per debug interno
  verifySmtp,
  sendRaw,
  sendWelcomeEmail,
  notifyAdminNewRegistration,
  sendPaymentConfirmationToUser,
  notifyAdminPayment,
  sendPasswordResetEmail,
};