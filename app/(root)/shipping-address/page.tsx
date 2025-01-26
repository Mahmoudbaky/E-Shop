import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";

export const page = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const session = await auth(); // i have to grap the session info frist using auth function

  const userId = session?.user?.id;

  if (!userId) throw new Error("No user ID"); // validate the user id before passing it to the getUserById function

  const user = await getUserById(userId);

  return <div>page</div>;
};
