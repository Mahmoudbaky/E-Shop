"use server";

import { signInSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Sign in with credentials

export const signInWithCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // console.log(user);

    await signIn("credentials", user);
    return { success: true, message: "Sign in successful" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Invalid credentials" };
  }
};

// Sign out
export const signOutUser = async () => {
  await signOut();
  return { success: true, message: "Sign out successful" };
};
