import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ProductPrice from "./product-price";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import Rating from "../header/rating";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product }: { product: Product }) => {
  console.log(product.slug);
  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square relative overflow-hidden bg-muted">
        <span className="absolute top-2 right-2 z-10">
          {/* <Badge className="bg-primary text-white">New</Badge> */}
        </span>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            className="max-h-[300px] w-full object-cover"
            priority={true}
          />
        </Link>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <div>
            <ProductPrice value={Number(product.price)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Number(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            ({`${product.numReviews} reviews`})
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">In stock</div>
        <Button className="w-1/2">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

// slug : is the name of any thing but in url formate  example -> name-of-anything

/**
 * v0:
 *  <Card className="w-full max-w-sm overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square relative overflow-hidden bg-muted">
        <span className="absolute top-2 right-2 z-10">
          <Badge className="bg-primary text-white">New</Badge>
        </span>
        <img
          src="/placeholder.svg?height=400&width=400"
          alt="Product image"
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">Premium Headphones</h3>
            <p className="text-sm text-muted-foreground">Wireless Noise Cancelling</p>
          </div>
          <div className="text-lg font-bold">$149.99</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-2">(42 reviews)</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Experience crystal-clear sound with our premium wireless headphones featuring active noise cancellation and
          30-hour battery life.
        </p>
      </CardContent>
      <CardFooter className="p-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">In stock</div>
        <Button className="w-1/2">Add to Cart</Button>
      </CardFooter>
    </Card>
 */

/**
 * <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            className="max-h-[300px] w-full object-cover"
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4 ">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <div>
              <ProductPrice value={Number(product.price)} />
            </div>
          ) : (
            <p className="text-destructive">Out of stock</p>
          )}
        </div>
      </CardContent>
    </Card>
 */
