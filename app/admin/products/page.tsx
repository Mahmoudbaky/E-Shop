import { getAllProducts, deleteProduct } from "@/lib/actions/products.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import DeleteDialog from "@/components/shared/delete-dialog";
import { formatCurrency, formatId } from "@/lib/utils";
import Pagination from "@/components/shared/pagination";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const AdminProducts = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const session = await auth();

  if (session?.user?.role !== "admin") redirect("/admin/unauthorized");

  const products = await getAllProducts({
    query: searchText,
    page,
    category,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">Products</h1>
          {searchText && (
            <div className="flex items-center gap-3">
              <p className="text-gray-500">Search results for: {searchText}</p>
              <Link href="/admin/products">
                <Button asChild variant="outline">
                  <span className="text-gray-500">Clear search</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild>
          <Link href="/admin/products/create">Create new product</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-[100px]">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
};

export default AdminProducts;
