import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { v4 as uuidv4 } from "uuid";
import { createDeveloper, getDeveloperByEmail } from "@nubletrust/postgres-drizzle"; 
import { randomBytes } from "crypto";

export const authOptions = {
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
    async jwt({ token, user, account }) {
      if (account) token.accessToken = account.access_token;

      if (user && !token.id) {
        const email = user.email!;
        let dbUser = await getDeveloperByEmail(email);

        if (!dbUser) {
          dbUser = await createDeveloper({
            id: uuidv4(),
            email,
            passwordHash: randomBytes(6).toString("base64url")
          });
        }

        token.id = dbUser.id;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };