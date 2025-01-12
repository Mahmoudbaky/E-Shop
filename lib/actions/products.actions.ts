"use server";
import { prisma } from "@/db/prisma";
import { convertPrismaToJs } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

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
