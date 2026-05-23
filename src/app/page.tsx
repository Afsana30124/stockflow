"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  FaShoppingCart,
  FaSearch,
  FaStar,
} from "react-icons/fa";

type Product = {
  id: string;
  totalUnits: number;
  reservedUnits: number;

  product: {
    name: string;
  };

  warehouse: {
    name: string;
  };
};

export default function Home() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

const [loadingId, setLoadingId] =
  useState<string | null>(null);

  const [quantities, setQuantities] =
    useState<{ [key: string]: number }>({});

  async function fetchProducts() {

    const res = await fetch(
  "/api/products",
  {
    cache: "no-store",
  }
);

    const data = await res.json();

    setProducts(data);
  }

  async function reserveProduct(
    inventoryId: string
  ) {

    const quantity =
      quantities[inventoryId] || 1;

    setLoadingId(inventoryId);

    const res = await fetch(
      "/api/reserve",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          inventoryId,
          quantity,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {

      toast.success(
        "Product Reserved Successfully"
      );

    } else {

      toast.error(
        data.message
      );
    }

    await fetchProducts();

    setLoadingId("");
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts =
    products.filter((item) =>
      item.product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}

      <nav className="bg-black text-white px-8 py-4 flex justify-between items-center shadow-lg">

        <h1 className="text-3xl font-bold">
          StockFlow
        </h1>

        <div className="flex items-center bg-white rounded-lg overflow-hidden w-[40%]">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full px-4 py-2 text-black outline-none"
          />

          <div className="bg-yellow-400 px-4 py-3 text-black">
            <FaSearch />
          </div>

        </div>

        <div className="text-2xl cursor-pointer">
          <FaShoppingCart />
        </div>

      </nav>

      {/* Hero Section */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-10 text-center">

        <h2 className="text-5xl font-bold mb-4">
          Smart Inventory Reservation
        </h2>

        <p className="text-lg">
          Reserve products instantly with real-time stock tracking.
        </p>

      </div>

      {/* Product Grid */}

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredProducts.map((item) => {

          const available =
            item.totalUnits -
            item.reservedUnits;

          return (

            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
            >

              <img
  src={
    item.product.name.includes("iPhone")
      ? "https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg"

      : item.product.name.includes("Samsung")
      ? "https://m.media-amazon.com/images/I/71Sa3dqTqzL._SL1500_.jpg"

      : item.product.name.includes("MacBook")
      ? "https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg"

      : item.product.name.includes("Sony")
      ? "https://m.media-amazon.com/images/I/61vJtKbAssL._SL1500_.jpg"

      : item.product.name.includes("Watch")
      ? "https://images.unsplash.com/photo-1546868871-7041f2a55e12"

      : "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
  }

  alt="product"

  className="w-full h-64 object-contain bg-gray-50"
/>

              <div className="p-5">

                <div className="flex items-center gap-1 text-yellow-500 mb-2">

                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />

                  <span className="text-gray-500 ml-2">
                    5.0
                  </span>

                </div>

                <h2 className="text-2xl font-bold mb-2">
                  {item.product.name}
                </h2>

                <p className="text-gray-500 mb-3">
                  {item.warehouse.name}
                </p>

                <div className="flex gap-3 mb-4">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Total:
                    {" "}
                    {item.totalUnits}
                  </span>

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    Reserved:
                    {" "}
                    {item.reservedUnits}
                  </span>

                </div>

                <p className="font-semibold mb-4">

  Available:
  {" "}

  <span
    className={
      available > 3
        ? "text-green-600"
        : "text-red-500"
    }
  >
    {available}
  </span>

</p>

<div className="w-full bg-gray-200 rounded-full h-3 mb-4">

  <div
    className="bg-green-500 h-3 rounded-full transition-all duration-500"
    style={{
      width: `${
        (available / item.totalUnits) * 100
      }%`,
    }}
  />

</div>

                <div className="flex items-center gap-3">

                  <input
                    type="number"
                    min={1}
                    value={
                      quantities[item.id] || 1
                    }
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,

                        [item.id]:
                          Number(
                            e.target.value
                          ),
                      })
                    }
                    className="border rounded-lg px-3 py-2 w-20"
                  />

                  <button
                    onClick={() =>
                      reserveProduct(item.id)
                    }
                    disabled={
                      loadingId === item.id
                    }
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
                  >

                    {
                      loadingId === item.id
                        ? "Processing..."
                        : "Reserve Now"
                    }

                  </button>

                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Footer */}

      <footer className="bg-black text-white text-center py-5 mt-10">
        © 2026 StockFlow. All rights reserved.
      </footer>

    </div>
  );
}