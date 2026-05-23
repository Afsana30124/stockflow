import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { reservationId } = body;

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

    if (!reservation) {

      return NextResponse.json(
        {
          message: "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      reservation.status === "confirmed"
    ) {

      return NextResponse.json(
        {
          message: "Already confirmed",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: "confirmed",
      },
    });

    return NextResponse.json({
      message: "Reservation confirmed",
    });

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