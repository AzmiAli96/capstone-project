"use client"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import Toast from "@/components/Toast";
import axiosInstance from "@/lib/axiosInstance";
import Badge from "@/components/ui/badge";
import { HandCoins, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import UpdateStatusForm from "./update";
import StatusInfo from "./info";

export default function Payment() {
    const [items, setItems] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState<number | null>(null);
    const [isStatusInfoOpen, setIsStatusInfoOpen] = useState<boolean>(false);
    const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

    const fetchStatus = async (userId: number) => {
        try {
            const response = await axiosInstance.get("http://localhost:2000/status", {
                params: {
                    search: searchQuery,
                    page,
                    perPage,
                    userOnly: true,
                },
                withCredentials: true,
            });
            setItems(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Gagal mengambil data Status:", error);
            setToast({ type: "error", message: "Gagal mengambil data Status." });
        }
    };

    useEffect(() => {
        const fetchUserAndStatus = async () => {
            try {
                const res = await axios.get("/api/getUser");
                const uid = res.data.user.id;
                setUserId(uid);
                await fetchStatus(uid);
            } catch (error) {
                console.error("Error:", error);
                setToast({ type: "error", message: "Gagal memuat data." });
            }
        };

        fetchUserAndStatus();
    }, [page, searchQuery]);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
        if (userId) {
            await fetchStatus(userId);
        }
    };

    // Update
    const handleEditClick = (status: any) => {
        setSelectedStatus(status);
        setModalOpen(true);
    };

    const handleUpdateStatus = (updatedStatus: any) => {
        setItems((prev) => prev.map((u) => (u.id === updatedStatus.id ? updatedStatus : u)));
        setToast({ type: "success", message: "Status berhasil diupdate." });
    };

    // info
    const handleOpenStatusInfo = (statusId: string) => {
        setSelectedStatusId(statusId);
        setIsStatusInfoOpen(true);
    };

    const handleCloseStatusInfo = () => {
        setIsStatusInfoOpen(false);
    };

    const closeToast = () => setToast(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "error";
            case "Jemput Barang":
                return "primary";
            case "Menuju Tujuan":
                return "warning";
            case "Sampai Tujuan":
                return "success";
            default:
                return "light";
        }
    };
    const getPembayaranColor = (status: string) => {
        switch (status) {
            case "Belum dibayar":
                return "error";
            case "Proses":
                return "warning";
            case "Lunas":
                return "success";
            default:
                return "light";
        }
    };

    return (
        <>
            {toast && (
                <Toast type={toast.type} message={toast.message} onClose={closeToast} />
            )}

            <div className="min-h-screen bg-[#e3eaf2] flex items-center justify-center py-10 px-4">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-7xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Order</h2>
                        <Link href="/dashboard">
                            <button className="border border-gray-400 rounded-full px-4 py-1 hover:bg-gray-100">
                                Back
                            </button>
                        </Link>
                    </div>
                    {/* Search & Button */}
                    <div className="flex justify-between items-center w-full mb-4">
                        <form className="w-full max-w-md" onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Here..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-6 py-3 shadow focus:border-blue-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
                                    aria-label="search-icon"
                                >
                                    <MagnifyingGlassCircleIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/70">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1100px]">
                                <Table>
                                    <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                        <TableRow>
                                            <TableCell isHeader>No</TableCell>
                                            <TableCell isHeader>Name / Toko</TableCell>
                                            <TableCell isHeader>Tujuan</TableCell>
                                            <TableCell isHeader>Status Pengiriman</TableCell>
                                            <TableCell isHeader>Status Pembayaran</TableCell>
                                            <TableCell isHeader>Total</TableCell>
                                            <TableCell isHeader>Action</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.isArray(items) && items.map((item, index) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.pengiriman?.user?.name}</TableCell>
                                                <TableCell>{item.pengiriman?.tujuan}</TableCell>
                                                <TableCell>
                                                    <Badge color={getStatusColor(item.spengiriman)} variant="light">
                                                        {item.spengiriman}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge color={getPembayaranColor(item.spembayaran)} variant="light">
                                                        {item.spembayaran}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Intl.NumberFormat('id-ID').format(item.pengiriman?.total)}
                                                </TableCell>

                                                <TableCell>
                                                    <button
                                                        className="bg-green-600 text-white hover:underline py-1 px-3 rounded"
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        <HandCoins size={20} />
                                                    </button>
                                                    <button
                                                        className="ml-2 bg-blue-600 text-white text-white py-1 px-3 rounded hover:underline"
                                                        onClick={() => handleOpenStatusInfo(item.id)}
                                                    >
                                                        <Info size={20} />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <nav aria-label="Page navigation" className="flex justify-center mt-6">
                        <ul className="inline-flex -space-x-px text-sm">
                            <li>
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight 
              text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-e-0 
              border-gray-300 dark:border-gray-700 rounded-s-lg hover:bg-gray-100 
              dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                            </li>

                            {Array.from({ length: Math.ceil(total / perPage) }, (_, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => setPage(index + 1)}
                                        className={`flex items-center justify-center px-3 h-8 leading-tight border ${page === index + 1
                                            ? "text-blue-600 border-gray-300 bg-blue-50 dark:bg-gray-700 dark:text-blue-400"
                                            : "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            <li>
                                <button
                                    onClick={() => {
                                        const maxPage = Math.ceil(total / perPage);
                                        if (page < maxPage) setPage(page + 1);
                                    }}
                                    disabled={page >= Math.ceil(total / perPage)}
                                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 
              dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 
              dark:border-gray-700 rounded-e-lg hover:bg-gray-100 dark:hover:bg-gray-700 
              disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <UpdateStatusForm
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onUpdateStatus={handleUpdateStatus}
                status={selectedStatus}
            />
            <StatusInfo
                isOpen={isStatusInfoOpen}
                onClose={handleCloseStatusInfo}
                statusId={selectedStatusId}
            />
        </>
    );
}
