import { signIn } from "@/auth"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import LoginErrorBanner from "@/components/login-error-banner"
import RegisterSuccessToast from "@/components/register-success-toast"
import { SignIn } from "@/components/auth-components"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string; "password-reset"?: string }>
}) {
  const session = await auth()

  if (session) {
    redirect("/dashboard/tasks")
  }

  const { error, ["password-reset"]: passwordReset } = await searchParams

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <RegisterSuccessToast />

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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[140px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <LoginErrorBanner error={error} />

          {passwordReset === "true" && (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm" role="status" aria-live="polite">
              <p className="font-semibold">Senha redefinida com sucesso.</p>
              <p className="text-emerald-700">Agora voce ja pode entrar com seu email e senha no TaskMaster.</p>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-200/50 border border-gray-100 p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bem-vindo</h2>
              <p className="text-gray-500 mt-2 font-medium">Acesse sua conta para continuar</p>
            </div>

            <div className="space-y-6">
              <SignIn />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-gray-400">
                  <span className="bg-white px-4">Ou e-mail</span>
                </div>
              </div>

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
                    placeholder="********"
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

              <div className="pt-6 border-t border-gray-50 space-y-3 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  Nao tem conta?{" "}
                  <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-extrabold transition-colors">
                    Cadastre-se gratis
                  </Link>
                </p>
                <Link href="/forgot-password" className="inline-block text-[11px] font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-wider underline decoration-1 underline-offset-4">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-white/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-2">
            Ambiente Criptografado e Seguro
          </p>
          <Link href="/termos" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">
            Termos de Uso
          </Link>
        </div>
      </footer>
    </div>
  )
}
