import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      inventoryId,
      quantity,
    } = body;

    const inventory =
      await prisma.inventory.findUnique({
        where: {
          id: inventoryId,
        },
      });

    if (!inventory) {
      return NextResponse.json(
        {
          message: "Inventory not found",
        },
        {
          status: 404,
        }
      );
    }

    const available =
      inventory.totalUnits -
      inventory.reservedUnits;

    if (available < quantity) {
      return NextResponse.json(
        {
          message: "Not enough stock",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.inventory.update({
      where: {
        id: inventoryId,
      },
      data: {
        reservedUnits: {
          increment: quantity,
        },
      },
    });

    const reservation =
      await prisma.reservation.create({
        data: {
          inventoryId,
          quantity,
          status: "reserved",
          expiresAt: new Date(
            Date.now() + 15 * 60 * 1000
          ),
        },
      });

    return NextResponse.json(
      reservation
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}