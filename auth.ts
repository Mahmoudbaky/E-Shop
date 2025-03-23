import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

import { cookies } from "next/headers";

import { compareSync } from "bcrypt-ts-edge";
import { authConfig } from "./auth.config";
import { CartItem } from "./types";
import { InputJsonValue } from "@prisma/client/runtime/library";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
        session.user.role = user.role;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }

        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            const userCart = await prisma.cart.findFirst({
              where: { userId: user.id },
            });

            if (sessionCart && !userCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            } else if (sessionCart && userCart) {
              // const allItems = [...userCart.items, ...sessionCart.items];

              // const duplicates = (allItems as CartItem[]).map(item => item)

              const mergedItems = [
                ...userCart.items,
                ...sessionCart.items,
              ] as CartItem[];

              const uniqueItems = mergedItems.reduce((acc, item) => {
                const existingItem = acc.find(
                  (i) => i.productId === item.productId
                );
                if (existingItem) {
                  existingItem.qty += item.qty;
                } else {
                  acc.push(item);
                }
                return acc;
              }, [] as CartItem[]);

              await prisma.cart.update({
                where: { id: userCart.id },
                data: {
                  items: uniqueItems as InputJsonValue[],
                  itemsPrice:
                    Number(userCart.itemsPrice) +
                    Number(sessionCart.itemsPrice),
                  shippingPrice:
                    Number(userCart.shippingPrice) +
                    Number(sessionCart.shippingPrice),
                  taxPrice:
                    Number(userCart.taxPrice) + Number(sessionCart.taxPrice),
                  totalPrice:
                    Number(userCart.totalPrice) +
                    Number(sessionCart.totalPrice),
                },
              });

              await prisma.cart.deleteMany({
                where: { sessionCartId: sessionCart.sessionCartId },
              });
            }
          }
        }
      }

      // Handle session updates
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
