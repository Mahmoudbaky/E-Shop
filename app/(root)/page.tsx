import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";

const page = () => {
  return (
    <>
      <ProductList data={sampleData.products} title="New arrivals" limit={4} />
    </>
  );
};

export default page;
