import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

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
 *
 *
 *
 */

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatError = (error: any) => {
  if (error.name === "ZodError") {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );

    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
};

export const round2 = (value: number | string) => {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
};

// explain "Number.EPSILON" :

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number | string | null) => {
  if (typeof value === "number") {
    return CURRENCY_FORMATTER.format(value);
  } else if (typeof value === "string") {
    return CURRENCY_FORMATTER.format(Number(value));
  } else {
    return "NaN";
  }
};

// formate the id
export const formatId = (id: string) => {
  return `..${id.substring(id.length - 6)}`;
};

// Formate the data and time
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form the pagination links
export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) => {
  const query = qs.parse(params); // Why we have to convert the query to object : because the query is a string and we can't change it directly so we have to convert it to object to change it

  query[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
};

// Format Number
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export const formatNumber = (number: number) => {
  return NUMBER_FORMATTER.format(number);
};

/**
 * study section:- 
 * -------------- 
  ** Intl: Intl is a built-in object in JavaScript that provides language-sensitive string comparison, 
 * number formatting, and date and time formatting. It's short for "Internationalization,"
 *  
 * ex: const currencyFormatter = new Intl.NumberFormat("en-US", {
   style: "currency",
   currency: "USD" });
   console.log(currencyFormatter.format(123456.789)); // Output: $123,456.79


  ** str.substring(indexStart, indexEnd)
 * indexStart: The position where to start the extraction. The first character has an index of 0.
 * indexEnd (optional): The position where to end the extraction. The character at this index will not be included. If omitted, substring extracts to the end of the string.
 * 
 * 
 * Type script notes :
 * <T> : this called typescript generic and it makes the function accept any type of parameters (string , object, prisma object , ....)
 * (value: T) : the type of the input parameter
 * : T : the type of the return from this function
 * 
 * 
 */
