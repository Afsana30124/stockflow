"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import toast from "react-hot-toast";

export default function ReservationPage() {

  const params = useParams();



const id = Array.isArray(params.id)
  ? params.id[0]
  : params.id;

  const [reservation, setReservation] =
    useState<any>(null);

  const [timeLeft, setTimeLeft] =
    useState(300);

  async function fetchReservation() {

    const res = await fetch(
      `/api/reservation/${id}`
    );

    const data = await res.json();

    setReservation(data);

    if (data.status === "expired") {

      toast.error(
        "Reservation expired"
      );
    }
  }

  async function confirmPurchase() {

    const res = await fetch(
      "/api/confirm",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          reservationId: id,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {

      toast.success(
        "Purchase Confirmed"
      );

      setTimeLeft(0);

      setTimeout(() => {

        window.location.href = "/";

      }, 1500);

    } else if (res.status === 410) {

      toast.error(
        "Reservation expired"
      );

    } else {

      toast.error(
        data.message
      );
    }
  }

  async function cancelReservation() {

    const res = await fetch(
      "/api/release",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          reservationId: id,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {

      toast.success(
        "Reservation Cancelled"
      );

      setTimeLeft(0);

      setTimeout(() => {

        window.location.href = "/";

      }, 1500);

    } else {

      toast.error(
        data.message
      );
    }
  }

 useEffect(() => {

  if (!id) return;

  fetchReservation();

  const timer = setInterval(() => {

    setTimeLeft((prev) => {

      if (prev <= 1) {

        clearInterval(timer);

        return 0;
      }

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(timer);

}, [id]);

      

  if (!reservation) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-[500px]">

        <h1 className="text-3xl font-bold mb-6">
          Reservation Checkout
        </h1>

        <div className="space-y-4">

          <p>
            <strong>Status:</strong>
            {" "}
            {reservation.status}
          </p>

          <p>
            <strong>Quantity:</strong>
            {" "}
            {reservation.quantity}
          </p>

          <p>
            <strong>Reservation ID:</strong>
            {" "}
            {reservation.id}
          </p>

          <div>

            <p className="font-semibold mb-2">
              Reservation expires in:
            </p>

            <div className="text-4xl text-red-500 font-bold">
              {timeLeft}s
            </div>

          </div>

          <div className="flex gap-4 pt-5">

            <button
              onClick={confirmPurchase}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              Confirm Purchase
            </button>

            <button
              onClick={cancelReservation}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}