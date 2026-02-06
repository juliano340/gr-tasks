import { registerUser } from "@/app/actions"
import RegisterForm from "@/components/register-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function RegisterPage() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard/tasks")
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* ─── NAV (Igual à Home) ─── */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Task<span className="text-indigo-600">Master</span>
            </span>
          </Link>

          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
            Já tem uma conta? Entrar
          </Link>
        </div>
      </nav>

      {/* ─── CONTEÚDO PRINCIPAL ─── */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        
        {/* Blobs decorativos de fundo (Consistência com a Home) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[140px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Lado Esquerdo: Texto e Social Proof */}
          <div className="hidden lg:block space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Join the community</span>
            </div>
            
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              A jornada para a <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                alta performance
              </span> <br />
              começa aqui.
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-[440px]">
              Crie sua conta em menos de um minuto e descubra por que mais de 1.200 usuários escolheram o TaskMaster.
            </p>

            <div className="space-y-4">
              {[
                "Plano gratuito para sempre",
                "Interface focada em execução",
                "Sincronização instantânea"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito: Card do Formulário */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-200/50 border border-gray-100 p-8 md:p-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Criar sua conta</h2>
                <p className="text-gray-500 text-sm mt-1">Insira seus dados para começar gratuitamente.</p>
              </div>

              <RegisterForm action={registerUser} />

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  Ao continuar, você concorda com nossos <br />
                  <Link href="/termos" className="text-indigo-600 font-bold hover:underline">Termos de Serviço</Link>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─── FOOTER (Igual à Home) ─── */}
      <footer className="py-8 bg-white/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 font-medium mb-1">
            © 2026 TaskMaster App.
          </p>
          <Link href="/termos" className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors">
            Termos de Uso
          </Link>
        </div>
      </footer>
    </div>
  )
}