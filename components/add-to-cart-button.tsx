"use client ";

import { Button } from "./ui/button";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart } from "@/lib/actions/cart.action";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ToastAction } from "@/components/ui/toast";
import { Loader, Plus } from "lucide-react";

const AddToCartButton = ({ item }: { item: CartItem }) => {
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
            className="bg-primary  text-white hover:bg-gray-800"
            altText="Go to Cart"
            onClick={() => router.push("/cart")}
          >
            Go to cart
          </ToastAction>
        ),
      });
    });
  };
  return (
    <Button onClick={handleAddToCart} className="w-1/2">
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  );
};

export default AddToCartButton;
