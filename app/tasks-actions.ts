"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { logToFile } from "@/lib/logger"

const PLAN_LIMITS = {
  free: 5,
  premium: 50,
}

async function getUserPlan(userId: string) {
  try {
    const subscription = await (prisma as any).subscription.findUnique({
      where: { userId },
    })
    
    return subscription?.plan || "free"
  } catch (error: any) {
    return "free"
  }
}

async function getTaskCount(userId: string) {
  return await (prisma as any).task.count({
    where: { userId },
  })
}

export async function createTask(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Não autenticado" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as string || "normal"
  const dueDate = formData.get("dueDate") as string

  if (!title || title.trim().length === 0) {
    return { error: "Título é obrigatório" }
  }

  // Verifica limite do plano
  const plan = await getUserPlan(session.user.id)
  const currentCount = await getTaskCount(session.user.id)
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]

  if (currentCount >= limit) {
    return { 
      error: `Limite de ${limit} tasks atingido. ${plan === "free" ? "Faça upgrade para Premium!" : ""}`,
      limitReached: true 
    }
  }

  await (prisma as any).task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/tasks")
  return { success: true }
}

export async function updateTask(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Não autenticado" }
  }

  const id = formData.get("id") as string
  const task = await (prisma as any).task.findUnique({
    where: { id },
  })

  if (!task || task.userId !== session.user.id) {
    return { error: "Task não encontrada" }
  }

  // Verifica plano para edição (não apenas toggle complete)
  const plan = await getUserPlan(session.user.id)
  const isPremium = plan === "premium"

  if (!isPremium) {
    return { error: "Edição de tarefas é um recurso Premium. Faça upgrade para editar!" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = formData.get("priority") as string
  const dueDate = formData.get("dueDate") as string
  const completed = formData.get("completed") === "true"

  if (!title || title.trim().length === 0) {
    return { error: "Título é obrigatório" }
  }

  await (prisma as any).task.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || task.priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      completed,
      completedAt: completed && !task.completed ? new Date() : (completed ? task.completedAt : null),
    },
  })

  revalidatePath("/dashboard/tasks")
  return { success: true }
}

export async function deleteTask(taskId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Não autenticado" }
  }

  const task = await (prisma as any).task.findUnique({
    where: { id: taskId },
  })

  if (!task || task.userId !== session.user.id) {
    return { error: "Task não encontrada" }
  }

  await (prisma as any).task.delete({
    where: { id: taskId },
  })

  revalidatePath("/dashboard/tasks")
  return { success: true }
}

export async function toggleTaskComplete(taskId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Não autenticado" }
  }

  const task = await (prisma as any).task.findUnique({
    where: { id: taskId },
  })

  if (!task || task.userId !== session.user.id) {
    return { error: "Task não encontrada" }
  }

  const newCompletedState = !task.completed

  await (prisma as any).task.update({
    where: { id: taskId },
    data: { 
      completed: newCompletedState,
      completedAt: newCompletedState ? new Date() : null
    },
  })

  revalidatePath("/dashboard/tasks")
  return { success: true }
}

export async function getUserStats() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/")
  }

  const plan = await getUserPlan(session.user.id)
  const taskCount = await getTaskCount(session.user.id)
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]

  const tasks = await (prisma as any).task.findMany({
    where: { userId: session.user.id },
    orderBy: [
      { completed: "asc" },
      { createdAt: "desc" }
    ],
  })

  return {
    plan,
    taskCount,
    limit,
    tasks,
  }
}
