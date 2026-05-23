import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const warehouse1 =
    await prisma.warehouse.create({
      data: {
        name: "Bangalore Warehouse",
      },
    });

  const warehouse2 =
    await prisma.warehouse.create({
      data: {
        name: "Hyderabad Warehouse",
      },
    });

  const products = [
    {
      name: "iPhone 15",
      units: 10,
      warehouse: warehouse1.id,
    },

    {
      name: "Samsung Galaxy S24",
      units: 15,
      warehouse: warehouse2.id,
    },

    {
      name: "MacBook Air M3",
      units: 8,
      warehouse: warehouse1.id,
    },

    {
      name: "Sony WH-1000XM5",
      units: 20,
      warehouse: warehouse2.id,
    },

    {
      name: "Apple Watch Ultra",
      units: 12,
      warehouse: warehouse1.id,
    },

    {
      name: "iPad Pro",
      units: 7,
      warehouse: warehouse2.id,
    },
  ];

  for (const item of products) {

    const product =
      await prisma.product.create({
        data: {
          name: item.name,
        },
      });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        warehouseId: item.warehouse,
        totalUnits: item.units,
        reservedUnits: 0,
      },
    });
  }

  console.log(
    "Multiple products inserted"
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });