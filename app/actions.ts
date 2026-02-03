"use server"

import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  const validatedFields = RegisterSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  })

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const { name: vName, email: vEmail, password: vPassword } = validatedFields.data

  const existingUser = await prisma.user.findUnique({
    where: { email: vEmail },
  })

  if (existingUser) {
    return { error: "Email already in use" }
  }

  const hashedPassword = await bcrypt.hash(vPassword, 10)

  const user = await prisma.user.create({
    data: {
      name: vName,
      email: vEmail,
      password: hashedPassword,
    },
  })

  // Cria subscription gratuita automaticamente
  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: "free",
    },
  })

  redirect("/?registered=true")
}

// Forgot Password Action
export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email é obrigatório" }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.password) {
    // Não revela se o email existe por segurança
    return { success: "Se o email existir, você receberá um link de recuperação" }
  }

  // Gera token único
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 3600000) // 1 hora

  // Deleta tokens antigos deste email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  })

  // Cria novo token
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  // Envia email
  const { sendPasswordResetEmail } = await import("@/lib/email")
  try {
    await sendPasswordResetEmail(email, token)
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return { error: "Erro ao enviar email. Verifique as configurações." }
  }

  return { success: "Email de recuperação enviado!" }
}

// Reset Password Action
export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string
  const password = formData.get("password") as string

  if (!token || !password) {
    return { error: "Token e senha são obrigatórios" }
  }

  if (password.length < 6) {
    return { error: "A senha deve ter no mínimo 6 caracteres" }
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!resetToken) {
    return { error: "Token inválido ou expirado" }
  }

  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } })
    return { error: "Token expirado" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  })

  await prisma.passwordResetToken.delete({ where: { token } })

  redirect("/?password-reset=true")
}
