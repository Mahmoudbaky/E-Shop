"use server";
import { PrismaClient } from "@prisma/client";
import { convertPrismaToJs } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// get latest products
export const getLatestProducts = async () => {
  const prisma = new PrismaClient();

  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertPrismaToJs(data); // note: this will return an prisma object
};
