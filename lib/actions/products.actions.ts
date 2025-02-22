"use server";
import { prisma } from "@/db/prisma";
import { convertPrismaToJs, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductsSchema, updateProductsSchema } from "../validators";
import { Prisma } from "@prisma/client";

// get latest products
export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertPrismaToJs(data); // note: this will return an prisma object
};

//get single product by it's slug
export const getProductBySlug = async (value: string) => {
  return await prisma.product.findFirst({ where: { slug: value } });
};

//get single product by it's slug
export const getProductById = async (prodId: string) => {
  const data = await prisma.product.findFirst({ where: { id: prodId } });

  return convertPrismaToJs(data);
};

// get all products
// export const getAllProducts = async ({
//   query,
//   limit = PAGE_SIZE,
//   page,
//   category,
//   price,
//   rating,
//   sort,
// }: {
//   query: string;
//   limit?: number;
//   page: number;
//   category?: string;
//   price?: string;
//   rating?: string;
//   sort?: string;
// }) => {
//   const data = await prisma.product.findMany({
//     where: {
//       name: { contains: query, mode: "insensitive" },
//       category: { contains: query, mode: "insensitive" },
//       price: price ? { lte: parseInt(price) } : undefined,
//       rating: rating ? { gte: parseInt(rating) } : undefined,
//     },
//     orderBy: { createdAt: "desc" },
//     skip: (page - 1) * limit, // how many products will be skiped in take
//     take: limit, // how many  products will be taken
//   });

//   const dataCount = await prisma.product.count();

//   /* TODO: fix the total pages to hide the pagination buttons when there are few products returned */

//   return {
//     data,
//     totalPages: Math.ceil(dataCount / limit),
//   };
// };

// Delete a product
export const deleteProduct = async (id: string) => {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

// create product by admin
export const createProduct = async (
  data: z.infer<typeof insertProductsSchema>
) => {
  try {
    const product = insertProductsSchema.parse(data);
    await prisma.product.create({
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

// update product by admin
export const updateProduct = async (
  data: z.infer<typeof updateProductsSchema>
) => {
  try {
    const product = updateProductsSchema.parse(data);
    const exsitProduct = await prisma.product.findFirst({
      where: { id: data.id },
    });

    if (!exsitProduct) throw new Error("Product dose not exist");

    await prisma.product.update({
      where: { id: exsitProduct.id },
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

// get proudcts function by the mentor
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
        ? { price: "desc" }
        : sort === "rating"
        ? { rating: "desc" }
        : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
