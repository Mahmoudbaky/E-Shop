import { z } from "zod";
import {
  insertProductsSchema,
  insertCartSchema,
  cartItemSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductsSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema>;

/**
 * explination for & sign:
 * the & sign is used to create a new type that combines the inferred type from insertProductsSchema with additional properties (id, rating, and createdAt).
 *
 * This means that an object of type Product will have all the properties defined in insertProductsSchema, plus id, rating, and createdAt.
 */
