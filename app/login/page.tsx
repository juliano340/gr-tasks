

import { signIn } from "@/auth"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import LoginErrorBanner from "@/components/login-error-banner"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const session = await auth()
  
  // Se já estiver logado, vai direto para as tasks
  if (session) {
    redirect("/dashboard/tasks")
  }

  const { error } = await searchParams

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado Esquerdo - Design/Hero */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-indigo-600 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Gerencie suas tarefas <br /> com maestria.
          </h1>
          <p className="text-xl text-indigo-100 max-w-md">
            A ferramenta completa para organizar seu fluxo de trabalho e focar no que realmente importa.
          </p>
        </div>
        
        {/* Elementos decorativos abstractos */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex items-center justify-center p-8 bg-surface dark:bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-black dark:text-white">Bem-vindo de volta</h2>
            <p className="mt-2 text-black/90 dark:text-gray-800 font-medium">
              Acesse sua conta para continuar
            </p>
          </div>

          <LoginErrorBanner error={error} />

          <div className="space-y-4">
            {/* Google Login */}
            <form
              action={async () => {
                "use server"
                await signIn("google", { redirectTo: "/dashboard/tasks" })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-black hover:text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.1-1.94 3.3-4.82 3.3-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface dark:bg-background px-2 text-black/90 font-bold">Ou entre com email</span>
              </div>
            </div>

            {/* Credentials Login */}
            <form
              action={async (formData) => {
                "use server"
                try {
                  await signIn("credentials", formData)
                } catch (error) {
                  if (error instanceof AuthError) {
                    redirect(`/login?error=${error.type}`)
                  }
                  throw error
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-black/90 dark:text-gray-800 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  // CORREÇÃO AQUI: text-black fixo e removido o dark:text-white
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black/90 dark:text-gray-800 mb-1">
                  Senha
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  // CORREÇÃO AQUI: text-black fixo e removido o dark:text-white
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-black placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" title="Esqueceu?" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Entrar agora
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-black/90 dark:text-gray-800">
                Ainda não tem uma conta?{" "}
                <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-black">
                  Cadastre-se grátis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
