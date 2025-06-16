"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  bulan: string;
  jumlah: number;
}

export default function OrderChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch("http://localhost:2000/order/chart", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("Gagal mengambil data chart", err));
  }, []);

  return (
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Grafik Order per Bulan
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="bulan"
              tick={{ fill: "#4B5563", fontSize: 14 }}
              tickFormatter={(bulan) =>
                new Date(`${bulan}-01`).toLocaleString("id-ID", {
                  month: "short",
                  year: "numeric",
                })
              }
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} order`, "Jumlah"]}
              labelFormatter={(bulan) =>
                new Date(`${bulan}-01`).toLocaleString("id-ID", {
                  month: "long",
                  year: "numeric",
                })
              }
            />
            <Line
              type="monotone"
              dataKey="jumlah"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
  );
}
