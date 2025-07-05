"use client";

import Badge from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function TargetStatus() {
    const [statusCount, setStatusCount] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchStatusCount = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/count`, {
                    credentials: "include",
                });
                const data = await res.json();
                setStatusCount(data);
            } catch (error) {
                console.error("Failed to fetch status count:", error);
            }
        };

        fetchStatusCount();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "error";
            case "Jemput Barang":
                return "primary";
            case "Menuju Tujuan":
                return "warning";
            case "Belum dibayar":
                return "error";
            default:
                return "light";
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-5 px-4 py-3 sm:gap-8 sm:py-4">
                <div>
                    <Badge color={getStatusColor("Pending")} variant="light">
                        <div className="p-2 flex flex-col items-center">
                            Pending
                            <p className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                                {statusCount.pending ?? 0}
                            </p>
                        </div>
                    </Badge>
                </div>

                <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

                <div>
                    <Badge color={getStatusColor("Jemput Barang")} variant="light">
                        <div className="p-2 flex flex-col items-center">
                            Jemput Barang
                            <p className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                                {statusCount.jemput ?? 0}
                            </p>
                        </div>
                    </Badge>
                </div>

                <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

                <div>
                    <Badge color={getStatusColor("Menuju Tujuan")} variant="light">
                        <div className="p-2 flex flex-col items-center">
                            Menuju Tujuan
                            <p className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                                {statusCount.menuju ?? 0}
                            </p>
                        </div>
                    </Badge>
                </div>

                <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

                <div>
                    <Badge color={getStatusColor("Belum dibayar")} variant="light">
                        <div className="p-2 flex flex-col items-center">
                            Belum Bayar
                            <p className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                                {statusCount.belumBayar ?? 0}
                            </p>
                        </div>
                    </Badge>
                </div>
            </div>
        </div>
    );

}
