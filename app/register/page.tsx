
import { registerUser } from "@/app/actions"
import RegisterForm from "@/components/register-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard/tasks")
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado Esquerdo - Info/Design */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-indigo-600 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30">
            <span className="text-xs font-bold uppercase tracking-widest">Grátis para sempre</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Junte-se a <br /> milhares de <br /> produtivos.
          </h1>
          <ul className="space-y-4 text-indigo-100 italic">
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs not-italic font-bold">✓</span>
              Até 5 tarefas simultâneas no plano grátis
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs not-italic font-bold">✓</span>
              Sincronização em tempo real
            </li>
            <li className="flex items-center gap-3">
              <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs not-italic font-bold">✓</span>
              Integração segura com Stripe
            </li>
          </ul>
        </div>
        
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Lado Direito - Form */}
      <div className="flex items-center justify-center p-8 bg-surface dark:bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-black dark:text-white leading-tight">Comece agora</h2>
            <p className="mt-2 text-gray-800 dark:text-gray-800 font-medium leading-relaxed">
              Crie sua conta gratuita em poucos segundos
            </p>
          </div>

          <RegisterForm action={registerUser} />
          
          <div className="text-[10px] text-center text-gray-600 dark:text-gray-400 font-bold px-8 leading-tight">
            Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </div>
        </div>
      </div>
    </div>
  )
}






