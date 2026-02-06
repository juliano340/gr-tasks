import nodemailer from "nodemailer"

function createTransport() {
  const user = process.env.EMAIL_USER?.trim()
  const pass = process.env.EMAIL_PASSWORD?.trim()

  if (!user || !pass) {
    throw new Error("EMAIL_USER ou EMAIL_PASSWORD nao configurado.")
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  })
}

function getAppUrl() {
  const appUrl = process.env.NEXTAUTH_URL?.trim()
  if (!appUrl) {
    throw new Error("NEXTAUTH_URL nao configurado.")
  }

  return appUrl.replace(/\/+$/, "")
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = createTransport()
  const from = process.env.EMAIL_USER?.trim() as string
  const resetUrl = `${getAppUrl()}/reset-password?token=${encodeURIComponent(token)}`

  await transporter.sendMail({
    from,
    to: email,
    subject: "Recuperacao de Senha - TaskMaster",
    text: `Voce solicitou recuperacao de senha.\n\nUse este link para redefinir sua senha do TaskMaster (expira em 1 hora):\n${resetUrl}\n\nSe sua conta foi criada com Google, isso define apenas a senha do TaskMaster e nao altera sua senha do Google.\n\nSe nao foi voce, ignore este email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Recuperacao de Senha</h2>
        <p>Voce solicitou a recuperacao de senha para sua conta.</p>
        <p>Clique no botao abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Redefinir Senha
        </a>
        <p style="color: #666; font-size: 14px;">Este link expira em 1 hora.</p>
        <p style="color: #666; font-size: 14px;">Se sua conta foi criada com Google, isso altera apenas a senha do TaskMaster e nao a senha do Google.</p>
        <p style="color: #666; font-size: 14px;">Se nao foi voce, ignore este email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">TaskMaster</p>
      </div>
    `,
  })
}
