"use server";

import { CartItem } from "@/types";
import { convertPrismaToJs, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { cookies } from "next/headers";

// re
import { revalidatePath } from "next/cache";
import { Prisma, Product } from "@prisma/client";

const calcPrice = async (items: CartItem[]) => {
  const cart = await getMyCart();

  let itemsPrice = 0;

  for (const item of items) {
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    itemsPrice += Number(product?.price) * item.qty;
  }
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToCart = async (data: CartItem) => {
  try {
    // console.log(data);
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // session and user id
    const session = await auth(); // this auth always returns session
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get the cart
    const cart = await getMyCart();

    // validate the item passed from the product page
    const item = cartItemSchema.parse(data);

    // Find product in data base
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Create new cart object

      // calcPrice([item]).then((res) => console.log(res));

      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...(await calcPrice([item])),
      });

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      // what is revalidating
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      const itemExist = (cart.items as CartItem[]).find(
        (i) => i.productId === item.productId
      );

      if (itemExist) {
        // check stock
        if (product.stock < itemExist.qty + 1) {
          throw new Error("Product out of stock");
        }

        // increase qty
        (cart.items as CartItem[]).find(
          (i) => i.productId === item.productId
        )!.qty = itemExist.qty + 1;
      } else {
        // check stock
        if (product.stock < 1) {
          throw new Error("Product out of stock");
        }

        // add new item
        (cart.items as CartItem[]).push(item);
      }

      // update the database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...(await calcPrice(cart.items as CartItem[])),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          itemExist ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    // console.log(error);
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export const getMyCart = async () => {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // session and user id
  const session = await auth(); // this auth always returns session
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get cart from data base
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertPrismaToJs({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
};

export const removeFromCart = async (productId: string) => {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // check for the product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // check for the cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    // check for item
    const itemExist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!itemExist) throw new Error("item is not exist");

    // check if item only one in the cart
    if (itemExist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== itemExist.productId
      );
    } else {
      // decrease the qty of item
      (cart.items as CartItem[]).find(
        (i) => i.productId === itemExist.productId
      )!.qty = itemExist.qty - 1;
    }

    // update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...(await calcPrice(cart.items as CartItem[])),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} is removed from the cart`,
    };
  } catch (error) {
    return {
      success: true,
      message: formatError(error),
    };
  }
};

export const getCartCount = async (id: string) => {
  try {
    const cookiesObject = await cookies();
    const sessionCartId = cookiesObject.get("sessionCartId")?.value;

    const cartIdFilter: Prisma.CartWhereInput = id
      ? {
          userId: id,
        }
      : {
          sessionCartId,
        };

    const cart = await prisma.cart.findFirst({
      where: { ...cartIdFilter },
    });

    const cartItemsCount = (cart?.items as CartItem[])
      .map((i) => i.qty)
      .reduce((total, current) => total + current);

    return { success: true, message: "success", data: cartItemsCount };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

/**
 * what is revalidatePath in nextJs :
 *
 *
 *
 *
 */
