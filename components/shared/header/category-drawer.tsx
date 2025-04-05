import { getAllCategories } from "@/lib/actions/products.actions";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
  const categories = await getAllCategories();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-sm h-full">
        <DrawerHeader>
          <DrawerTitle className="mx-3">Categories</DrawerTitle>
          <div className="space-y-1">
            {categories.map((c) => (
              <Button
                key={c.category}
                variant="ghost"
                className="justify-start w-full mt-4"
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${c.category}`}>
                    {c.category} ({c._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
