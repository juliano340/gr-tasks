import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SignOut } from "@/components/auth-components"
import Link from "next/link"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Painel do Usuário
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Área segura e restrita
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || "Usuário"} 
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-indigo-50 shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center ring-4 ring-indigo-50 shadow-inner">
                  <span className="text-4xl text-indigo-600 font-bold">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <span className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full shadow-sm" title="Online"></span>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                {session.user?.name || "Usuário Anônimo"}
              </h3>
              <div className="bg-gray-100 px-3 py-1 rounded-full inline-block">
                <p className="text-sm font-medium text-gray-600">
                    {session?.user?.email}
                </p>
              </div>
              <div className="pt-2">
                 <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    Autenticado
                </span>
              </div>
            </div>

            <div className="w-full border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/dashboard/tasks" 
                  className="w-full flex justify-center items-center py-2 px-4 border border-indigo-300 bg-indigo-50 rounded-lg shadow-sm text-sm font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  📋 Tasks
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  className="w-full flex justify-center items-center py-2 px-4 border border-violet-300 bg-violet-50 rounded-lg shadow-sm text-sm font-medium text-violet-700 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
                >
                  ⚙️ Configs
                </Link>
                <Link 
                  href="/" 
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Início
                </Link>
              </div>
              <div className="mt-3">
                <SignOut />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
