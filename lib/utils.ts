import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// convert the prisma object to a normal js object
export function convertPrismaToJs<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

/**
 * Type script notes :
 *
 * <T> : this called typescript generic and it makes the function accept any type of parameters (string , object, prisma object , ....)
 * (value: T) : the type of the input parameter
 * : T : the type of the return from this function
 *
 *
 */
