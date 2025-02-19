import { getProductById } from "@/lib/actions/products.actions";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/product-form";

const UpdateProductAdminPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const prodcut = await getProductById(id);

  if (!prodcut) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h1-bold">Update Product</h1>
      <ProductForm type="Update" product={prodcut} productId={id} />
    </div>
  );
};

export default UpdateProductAdminPage;
