import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";

// this is the configuration file for the NextAuth

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt", // revise this line
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });
        // if user is found
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // if user is found and password is correct
          if (isMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }
        // if no user is found or password is incorrect
        return null;
      },
    }),
  ],
  // This callback is triggered whenever a session is checked or updated
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID in the session object from the token's subject (sub) property
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If the session is being updated, set the user's name in the session object
      if (trigger === "update") {
        session.user.name = user.name;
      }

      // Return the modified session object
      return session;
    },
    // we need to customize the jwt token ... so we can add the user role to the token
    async jwt({ session, user, trigger, token }: any) {
      // Add role to the token
      if (user) {
        token.role = user.role;

        // If user has no name then use the email
        if (user.name == "new_user") {
          token.name = user.email!.split("@")[0];

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      return token;
    },
  },
} satisfies NextAuthConfig; // this line is added to satisfy the NextAuthConfig type "to solve the NextAuth(config) error"

export const { handlers, auth, signIn, signOut } = NextAuth(config);

// split returns an array
