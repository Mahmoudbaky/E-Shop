import { getAllProducts } from "@/lib/actions/products.actions";
import { PAGE_SIZE } from "@/lib/constants";

const SearchPage = async (props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const products = await getAllProducts({
    query: q,
    limit: PAGE_SIZE,
    page: 1,
    category,
    price,
    rating,
    sort: "desc",
  });

  // console.log(products);

  return <div>SearchPage</div>;
};

export default SearchPage;
