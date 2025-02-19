"use server";
import { prisma } from "@/db/prisma";
import { convertPrismaToJs, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductsSchema, updateProductsSchema } from "../validators";

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
export const getAllProducts = async ({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) => {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit, // how many products will be skiped in take
    take: limit, // how many  products will be taken
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
};

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
