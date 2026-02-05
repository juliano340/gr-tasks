"use server"

import { auth, signOut } from "@/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const PersonalDataSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
})

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação da senha deve ter pelo menos 6 caracteres"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export async function updatePersonalData(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Não autenticado" }

  const name = formData.get("name") as string
  const email = formData.get("email") as string

  const validated = PersonalDataSchema.safeParse({ name, email })
  if (!validated.success) return { error: "Dados inválidos" }

  const { name: vName, email: vEmail } = validated.data

  // Verifica se o email já está em uso por outro usuário
  if (vEmail !== session.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: vEmail },
    })
    if (existingUser) return { error: "Este e-mail já está em uso" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: vName, email: vEmail },
  })

  return { success: "Dados atualizados com sucesso!" }
}

export async function updatePassword(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Não autenticado" }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  const validated = PasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword })
  if (!validated.success) return { error: validated.error.issues[0].message }

  const { currentPassword: vCurrent, newPassword: vNew } = validated.data

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || !user.password) return { error: "Usuário não encontrado ou sem senha definida" }

  const isPasswordValid = await bcrypt.compare(vCurrent, user.password)
  if (!isPasswordValid) return { error: "Senha atual incorreta" }

  const hashedPassword = await bcrypt.hash(vNew, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return { success: "Senha atualizada com sucesso!" }
}

export async function deleteAccount(prevState: any) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Não autenticado" }

  try {
    // 1. Gerenciar Stripe
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (subscription?.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
      } catch (stripeError) {
        console.error("Erro ao cancelar assinatura no Stripe:", stripeError)
      }
    }

    // 2. Remover do Banco de Dados
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    // 3. Logout
    await signOut({ redirect: false })
    
    // 4. Set confirmation cookie
    const cookieStore = await cookies()
    cookieStore.set("account-deleted", "true", { maxAge: 60, path: "/" })
    
  } catch (error) {
    console.error("Erro ao deletar conta:", error)
    return { error: "Erro ao excluir conta. Tente novamente mais tarde." }
  }

  // Final redirect must be outside try-catch to work in Server Actions
  redirect("/")
}

export async function clearDeletedCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("account-deleted")
}
