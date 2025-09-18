import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: DefaultSession["user"] & {
      id?: string
    }
  }

  interface User extends DefaultUser {
    id?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
  }
}


