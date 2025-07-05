"use client";
import React, { useEffect, useState } from "react";
import { InboxStackIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Box, MapPlus, Users } from "lucide-react";

export const Count = () => {
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [wilayahCount, setWilayahCount] = useState<number | null>(null);
  const [OrderCount, setOrderCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/count-customer`, {
          credentials: "include", // Kirim cookie secara otomatis
        });
        if (!res.ok) throw new Error("Gagal mengambil jumlah customer");

        const json = await res.json();
        setCustomerCount(json.count);
      } catch (err: any) {
        setError(err.message || "Error loading data");
      }
    };

    fetchCustomerCount();
  }, []);

  useEffect(() => {
    const fetchWilayahCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wilayah/count`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Gagal mengambil jumlah wilayah");

        const json = await res.json();
        setWilayahCount(json.count);
      } catch (err: any) {
        setError(err.message || "Error loading data");
      }
    };

    fetchWilayahCount();
  }, []);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/count`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Gagal mengambil jumlah Order");

        const json = await res.json();
        setOrderCount(json.count);
      } catch (err: any) {
        setError(err.message || "Error loading data");
      }
    };

    fetchOrderCount();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
      {/* Metric 1 - Customers */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
        <div className="flex items-center justify-center w-15 h-15 bg-blue-500 rounded-lg dark:bg-gray-800">
          <Users className="text-gray-800 size-10 dark:text-white/90" />
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Customers</span>
          <h4 className="mt-1 font-bold text-base text-gray-800 dark:text-white/90">
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : customerCount === null ? (
              "Loading..."
            ) : (
              customerCount.toLocaleString()
            )}
          </h4>
        </div>
      </div>

      {/* Metric 2 - Orders */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
        <div className="flex items-center justify-center w-15 h-15 bg-green-400 rounded-lg dark:bg-gray-800">
          <Box className="text-gray-800 size-10 dark:text-white/90" />
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Orders</span>
          <h4 className="mt-1 font-bold text-base text-gray-800 dark:text-white/90">
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : OrderCount === null ? (
              "Loading..."
            ) : (
              OrderCount.toLocaleString()
            )}
          </h4>
        </div>
      </div>

      {/* Metric 3 - Wilayah */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
        <div className="flex items-center justify-center w-15 h-15 bg-yellow-400 rounded-lg dark:bg-gray-800">
          <MapPlus className="text-gray-800 size-10 dark:text-white/90" />
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">Tujuan Wilayah / Kota</span>
          <h4 className="mt-1 font-bold text-base text-gray-800 dark:text-white/90">
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : wilayahCount === null ? (
              "Loading..."
            ) : (
              wilayahCount.toLocaleString()
            )}
          </h4>
        </div>
      </div>
    </div>
  );

};
