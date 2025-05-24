import React from "react";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.action";
import { CartItem, Product } from "@/types";
import { prisma } from "@/db/prisma";
import { convertPrismaToJs } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CartPage = async () => {
  const cart = await getMyCart();

  const data = cart?.items.map(
    async (item: CartItem) =>
      await prisma.product.findFirst({ where: { id: item.productId } })
  );

  if (!data)
    return (
      <div>
        <p>Your cart is empty</p>
        <Button className="mt-5">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );

  const products = convertPrismaToJs(await Promise.all(data!));

  return (
    <div className="container mx-auto">
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      <CartTable cart={cart} products={products as Product[]} />
    </div>
  );
};

export default CartPage;
