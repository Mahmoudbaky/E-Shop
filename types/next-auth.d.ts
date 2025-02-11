import { DefaultSession } from "next-auth";

// this code is to add the role for the user session
declare module "next-auth" {
  export interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}
