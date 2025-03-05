import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/products.actions";
import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import ProdcutImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.action";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/header/rating";

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await getMyCart();
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Image coloumn */}
          <div className="col-span-2 mr-4">
            <ProdcutImages images={product.images} />
          </div>
          {/* details coloumn */}
          <div className="col-span-2">
            <div className="flex flex-col gap-6">
              <p>{`${product.brand} ${product.category}`}</p>
              <p className="h3-bold">{product.name}</p>
              <Rating value={Number(product.rating)} />
              <p>{product.numReviews} reviews</p>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full  bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description:</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* action coloumn */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p>Price</p>
                  </div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>Stock</div>
                  <div>
                    {product.stock > 0 ? (
                      <Badge variant="outline">In stock</Badge>
                    ) : (
                      <Badge variant="destructive">Out of stock</Badge>
                    )}
                  </div>
                </div>
                {product.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h1 className="h3-bold">Customers Reviews</h1>
        <ReviewList
          userId={userId || ""}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;
