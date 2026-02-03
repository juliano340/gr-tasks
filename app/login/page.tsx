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
  
  if (session) {
    redirect("/dashboard/tasks")
  }

  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* ─── NAV ─── */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Task<span className="text-indigo-600">Master</span>
            </span>
          </Link>
          <Link href="/register" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
            Criar conta gratuita
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Fundo Decorativo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[140px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <LoginErrorBanner error={error} />

          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-200/50 border border-gray-100 p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bem-vindo</h2>
              <p className="text-gray-500 mt-2 font-medium">Acesse sua conta para continuar</p>
            </div>

            <div className="space-y-6">
              {/* Google Login */}
              <form action={async () => {
                  "use server"
                  await signIn("google", { redirectTo: "/dashboard/tasks" })
                }}>
                <button type="submit" className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-700 shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.1-1.94 3.3-4.82 3.3-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Entrar com Google
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-gray-400">
                  <span className="bg-white px-4">Ou e-mail</span>
                </div>
              </div>

              {/* Form de Autenticação Puro */}
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">E-mail</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide ml-1">Senha</label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98] mt-2"
                >
                  Entrar no TaskMaster
                </button>
              </form>

              {/* Links Auxiliares - Lá embaixo, bem discretos */}
              <div className="pt-6 border-t border-gray-50 space-y-3 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  Não tem conta?{" "}
                  <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-extrabold transition-colors">
                    Cadastre-se grátis
                  </Link>
                </p>
                <Link href="/forgot-password" size="sm" className="inline-block text-[11px] font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-wider underline decoration-1 underline-offset-4">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          Ambiente Criptografado e Seguro
        </div>
      </footer>
    </div>
  )
}