const nodemailer = require("nodemailer");

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return null;
  }
  return process.argv[index + 1];
}

async function main() {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const verifyOnly = process.argv.includes("--verify-only");

  if (!emailUser || !emailPassword) {
    console.error("[ERROR] EMAIL_USER ou EMAIL_PASSWORD nao configurado(s).\nUse: npm run test:email");
    process.exit(1);
  }

  const recipient = getArgValue("--to") || process.env.TEST_EMAIL_TO || emailUser;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  console.log("[INFO] Verificando conexao SMTP...");
  await transporter.verify();
  console.log("[OK] Conexao SMTP validada.");

  if (verifyOnly) {
    console.log("[INFO] Modo verify-only. Envio ignorado.");
    return;
  }

  console.log(`[INFO] Enviando email de teste para ${recipient}...`);
  const info = await transporter.sendMail({
    from: emailUser,
    to: recipient,
    subject: "Teste Nodemailer - atendimento",
    text: "Email de teste enviado com sucesso.",
    html: "<p>Email de teste enviado com sucesso.</p>",
  });

  console.log("[OK] Email enviado.");
  console.log(`[INFO] messageId: ${info.messageId}`);
  if (Array.isArray(info.accepted) && info.accepted.length > 0) {
    console.log(`[INFO] accepted: ${info.accepted.join(", ")}`);
  }
}

main().catch((error) => {
  console.error("[ERROR] Falha no teste de email:");
  console.error(error?.message || error);
  process.exit(1);
});
