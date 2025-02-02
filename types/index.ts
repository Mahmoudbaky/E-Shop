import { z } from "zod";
import {
  insertProductsSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderSchema,
  insertOrderItemSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductsSchema> & {
  id: string; // here w add the items that will be inserted in the db table automatically , and in zod is schema we add items that will be added to the db table through a form "so we will need to validate the data typed in the fomr"
  rating: string;
  createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
};

/**
 * explination for & sign:
 * the & sign is used to create a new type that combines the inferred type from insertProductsSchema with additional properties (id, rating, and createdAt).
 *
 * This means that an object of type Product will have all the properties defined in insertProductsSchema, plus id, rating, and createdAt.
 */
