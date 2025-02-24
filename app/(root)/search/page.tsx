import ProductCard from "@/components/shared/product/product-card";
import {
  getAllProducts,
  getAllCategories,
} from "@/lib/actions/products.actions";
import { PAGE_SIZE } from "@/lib/constants";
import Link from "next/link";

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  // construct filter url
  const constructFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.category = p;
    if (s) params.category = s;
    if (r) params.category = r;
    if (pg) params.category = pg;

    return `/search?${new URLSearchParams(params).toString}`;
  };

  const products = await getAllProducts({
    query: q,
    limit: PAGE_SIZE,
    page: 1,
    category,
    price,
    rating,
    sort: "desc",
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* category filter */}
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={constructFilterUrl({ c: "all" })}
              >
                All
              </Link>
            </li>
            {categories.length > 0 &&
              categories.map((x) => (
                <li key={x.category}>
                  <Link
                    className={`${category === x.category && "font-bold"}`}
                    href={constructFilterUrl({ c: `${x.category}` })}
                  >
                    {x.category} ({x._count})
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
