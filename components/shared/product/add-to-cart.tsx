"use client";
import { Button } from "@/components/ui/button";
import { CartItem, Cart } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // that react hook initaite the toste
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart, removeFromCart } from "@/lib/actions/cart.action";
import { useRouter } from "next/navigation";

import { useTransition } from "react"; // to hanl

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

      toast({
        description: res.message,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-800"
            altText="Go to Cart"
            onClick={() => router.push("/cart")}
          >
            Go to cart
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveCart = async () => {
    startTransition(async () => {
      const res = await removeFromCart(item.productId);

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });

      return;
    });
  };

  // check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      variant="default"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;

/**
 *
 * useTransition:  helps with deferring updates in your app to keep the UI responsive, especially for expensive updates.
 *                 It allows you to prioritize user interactions like typing or clicking by making non-urgent updates happen asynchronously.
 */
