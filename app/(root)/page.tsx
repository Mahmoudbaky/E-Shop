import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/products.actions";

import ProductCarousel from "@/components/shared/product/product-carousel";

const page = async () => {
  const latestProducts = await getLatestProducts();

  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title="New arrivals" limit={4} />
    </>
  );
};

export default page;
