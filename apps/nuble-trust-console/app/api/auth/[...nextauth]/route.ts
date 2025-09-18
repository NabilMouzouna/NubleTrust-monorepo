import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { v4 as uuidv4 } from "uuid";
import { createDeveloper, getDeveloperByEmail } from "@nubletrust/postgres-drizzle"; 
import { randomBytes } from "crypto";
import type { NextAuthOptions, Account, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type AppJWT = JWT & {
  id?: string
  accessToken?: string
}

type AppSession = Session & {
  accessToken?: string
  user: NonNullable<Session["user"]> & { id?: string }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: User | null; account?: Account | null }) {
      const typedToken: AppJWT = token as AppJWT
      if (account && account.access_token) typedToken.accessToken = account.access_token;

      if (user && !typedToken.id) {
        const email = user.email!;
        let dbUser = await getDeveloperByEmail(email);

        if (!dbUser) {
          dbUser = await createDeveloper({
            id: uuidv4(),
            email,
            passwordHash: randomBytes(6).toString("base64url"),
          });
        }

        if (dbUser) typedToken.id = dbUser.id;
      }

      return typedToken;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const typedSession: AppSession = {
        ...(session as AppSession),
        user: {
          ...(session.user as AppSession["user"]),
          id: (token as AppJWT).id,
        },
        accessToken: (token as AppJWT).accessToken,
      }
      return typedSession;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };