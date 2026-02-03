import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLogged = !!req.auth
  const { nextUrl } = req

  const isAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register"
  const isPublicRoute = nextUrl.pathname === "/"

  // Se já estiver logado e tentar acessar login/registro ou a home, manda pro dashboard
  if (isLogged && (isAuthRoute || isPublicRoute)) {
    return NextResponse.redirect(new URL("/dashboard/tasks", nextUrl))
  }

  // Se NÃO estiver logado e tentar acessar dashboard, manda pro login
  if (!isLogged && nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

// Não rodar o middleware em arquivos estáticos, imagens, etc.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
