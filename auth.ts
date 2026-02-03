import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
          name: "Credenciais",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Senha", type: "password" }
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null
            
            const user = await prisma.user.findUnique({
              where: { email: credentials.email as string }
            })

            if (!user || !user.password) return null

            const isPasswordValid = await bcrypt.compare(
              credentials.password as string, 
              user.password
            )

            if (!isPasswordValid) return null

            return user
          }
        })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  debug: true,
})
