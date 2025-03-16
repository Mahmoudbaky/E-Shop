import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getCartCount } from "@/lib/actions/cart.action";
import { auth } from "@/auth";

const CartButton = async () => {
  const session = await auth();

  const res = await getCartCount(session?.user.id as string);

  const cartItemsCount = res.data ?? 0;

  return (
    <Button variant="ghost" className="relative mr-3">
      <Link className="flex gap-2 items-center" href="/cart">
        <ShoppingCart /> cart
      </Link>

      {cartItemsCount > 0 && (
        <Badge className="absolute top-[-7px] right-[-5px]">
          {cartItemsCount}
        </Badge>
      )}
    </Button>
  );
};

export default CartButton;

{
  /* <Button  className="relative">
      <Link href="/cart">
        <ShoppingCart /> cart
      </Link>
      <Badge className="absolute top-0 right-0">{cartItemsCount}</Badge>
    </Button> */
}
