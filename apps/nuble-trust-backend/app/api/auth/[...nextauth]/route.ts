import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { getUserByEmail } from "@nubletrust/postgres-drizzle"
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        const user = await getUserByEmail(credentials.email)
        if (!user) {
          throw new Error("User not found")
        }

        // 2. Validate password
        const isValid = await compare(credentials.password, user.passwordHash)
        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        // 3. Return user (will be stored in JWT/session)
        return {
          id: user.id,
          email: user.email
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }