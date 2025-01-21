import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine((value) =>
    /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value)))
  );

// schema for inserting products
export const insertProductsSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(), // the number that coming from the form will be in string coerce will convert it to number
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

/**
 * explain the price configuration:- 
 * 
 * Type and Coercion:

    The original type of price is a string (z.string()). This is because the input may come in as a string representation of a number.

 *  Refinement and Validation:

.refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value)))):

Number(value) converts the string to a number.

formatNumberWithDecimal(Number(value)) applies a function, likely to format the number with two decimal places.

^\d+(\.\d{2})?$ is a regular expression (regex) used to validate the format of the number. Let's break down this regex:

^ asserts the position at the start of the string.

\d+ matches one or more digits (0-9).

(\.\d{2})?$ matches an optional period followed by exactly two digits (0-9), ensuring that the number can either be an integer or a decimal with two places.

$ asserts the position at the end of the string.
 */

// schema for signing users in
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

//cart schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"), // nonnegative means the number should be greater than or equal to 0
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});
