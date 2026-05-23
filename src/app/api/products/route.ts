import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET() {

  const products =
    await prisma.inventory.findMany({

      include: {
        product: true,
        warehouse: true,
      },

    });

  const formatted =
    await Promise.all(

      products.map(async (item) => {

        const reservation =
          await prisma.reservation.findFirst({

            where: {
              inventoryId: item.id,
              status: "reserved",
            },

            orderBy: {
              createdAt: "desc",
            },

          });

        return {

          id: item.id,

          reservationId:
            reservation?.id || null,

          totalUnits:
            item.totalUnits,

          reservedUnits:
            item.reservedUnits,

          product: {
            name:
              item.product.name,
          },

          warehouse: {
            name:
              item.warehouse.name,
          },

        };
      })
    );

  return NextResponse.json(
    formatted,
    {
      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}