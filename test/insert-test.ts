import { prisma } from "@/db/prisma";
// import { formatError } from "../utils";
// import { Product } from "@/types";
import { faker } from "@faker-js/faker";

async function main() {
  const numberOfRecords = 20000;
  const batchSize = 100;

  for (let i = 0; i < numberOfRecords; i += batchSize) {
    const products = Array.from(
      { length: batchSize },
      (): {
        name: string;
        price: number;
        createdAt: Date;
        slug: string;
        category: string;
        brand: string;
        description: string;
        stock: number;
      } => ({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        createdAt: faker.date.past(),
        slug: faker.lorem.slug(),
        category: faker.commerce.department(),
        brand: faker.company.name(),
        description: faker.lorem.sentence(),
        stock: faker.number.int({ min: 1, max: 100 }),
      })
    );

    await prisma.product.createMany({
      data: products,
    });
  }

  console.log("done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
