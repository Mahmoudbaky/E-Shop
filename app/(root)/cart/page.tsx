import React from "react";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.action";

const CartPage = async () => {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
