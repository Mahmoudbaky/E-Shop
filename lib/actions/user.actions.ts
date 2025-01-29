"use server";
import {
  shippingAddressSchema,
  signInSchema,
  signUpSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";

// Sign in with credentials
export const signInWithCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    // console.log(formData)
    const user = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

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
};

//Sign Up
export const signUpUser = async (prevState: unknown, formData: FormData) => {
  try {
    const user = signUpSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User signed up successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
};

/*
  FormData: is a built-in web API that provides a way to construct a set of 
            key/value pairs representing form fields and their values.

*/

export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// update user address  (i wrote it)
export const updateUserAddress = async (address: ShippingAddress) => {
  try {
    const session = await auth();

    if (!session?.user?.id) throw new Error("User ID is undefined"); // i  have to check if the id is exist or not before i pass it to the getUser function

    const validatedAddress = shippingAddressSchema.parse(address); // i have to validate the address using shippingAddressSchema before i pass it to the update function

    await prisma.user.update({
      where: { id: session?.user?.id },
      data: { address: validatedAddress },
    });

    return { success: false, message: "User address updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
