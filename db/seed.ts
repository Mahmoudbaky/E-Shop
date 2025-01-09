// this file is used to put a sample data to the database
// we used this command to execute the function : npx tsx ./db/seed

import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

(async () => {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  console.log("done");
})();
