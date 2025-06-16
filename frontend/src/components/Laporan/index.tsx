"use client"
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import Toast from "@/components/Toast";
import axiosInstance from "@/lib/axiosInstance";
import LaporanForm from "./input";
import { Recycle, RefreshCw, Trash2 } from "lucide-react";
import ExportLaporanModal from "./export";

export default function Laporan() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [selectedLaporan, setSelectedLaporan] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    const [selectedLaporanId, setSelectedOrderId] = useState<string | null>(null);

    // get semua data wilayah + search
    const fetchLaporan = async () => {
        try {
            const response = await axiosInstance.get("http://localhost:2000/laporan", {
                params: {
                    search: searchQuery,
                    page,
                    perPage,
                },
                withCredentials: true,
            });

            setItems(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Gagal mengambil data laporan:", error);
            setToast({ type: "error", message: "Gagal mengambil data laporan." });
        }
    };

    useEffect(() => {
        fetchLaporan();
    }, [page, searchQuery]);

    useEffect(() => {
        console.log("ITEMS YANG DIKIRIM KE EXPORT:", items);
    }, [items]);

    //Search
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
        fetchLaporan();
    };

    const closeToast = () => setToast(null);

    // Delete
    const handleDelete = async (id: number) => {
        console.log("Menghapus Laporan dengan ID:", id); // Debug

        try {
            const token = localStorage.getItem("token");

            await axiosInstance.delete(`http://localhost:2000/laporan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setItems((prev) => prev.filter((wilayah) => wilayah.id !== id));
            setToast({ type: "success", message: "Laporan berhasil Dihapus." });
        } catch (error: any) {
            console.log("Gagal menghapus Laporan:", error.response?.data || error.message);
            setToast({ type: "error", message: "Gagal menghapus Laporan." });
        }
    };



    return (
        <>
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

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Export Laporan Bulanan
                </button>
                <ExportLaporanModal show={showModal} onClose={() => setShowModal(false)} />

                <button
                    onClick={openModal}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                    Buat Laporan Baru
                </button>
                <LaporanForm
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    mode="create"
                    onAddLaporan={(laporan: any) => {
                        setItems((prev) => [...prev, laporan]);
                        setToast({ type: "success", message: "Laporan berhasil ditambahkan." });
                    }}
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/70">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1100px]">
                        <Table>
                            <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                <TableRow>
                                    <TableCell isHeader>No</TableCell>
                                    <TableCell isHeader>Tanggal</TableCell>
                                    <TableCell isHeader>BB</TableCell>
                                    <TableCell isHeader>Total Kredit</TableCell>
                                    <TableCell isHeader>Total Debit</TableCell>
                                    <TableCell isHeader>Total Bersih</TableCell>
                                    <TableCell isHeader>Action</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(items) && items.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{new Date(item.tanggal).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}</TableCell>
                                        <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.bb)}</TableCell>
                                        <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.tkredit)}</TableCell>
                                        <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.tdebit)}</TableCell>
                                        <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.tbersih)}</TableCell>
                                        <TableCell>
                                            <button
                                                className="bg-green-600 hover:bg-blue-700 text-white hover:underline py-1 px-3 rounded"
                                                onClick={() => { setSelectedLaporan(item); openEditModal(); }}
                                            >
                                                <RefreshCw size={20} />
                                            </button>
                                            <button
                                                className="ml-2 bg-red-600 text-white text-white py-1 px-3 rounded hover:underline"
                                                onClick={() => {
                                                    if (confirm("Yakin ingin menghapus wilayah ini?")) {
                                                        handleDelete(item.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={20} />
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
            <LaporanForm
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                mode="edit"
                existingLaporan={selectedLaporan}
                onAddLaporan={(updatedLaporan: any) => {
                    setItems((prev) =>
                        prev.map((item) => (item.id === updatedLaporan.id ? updatedLaporan : item))
                    );
                    setToast({ type: "success", message: "Laporan berhasil diupdate." });
                }}
            />
            {toast && (
                <Toast type={toast.type} message={toast.message} onClose={closeToast} />
            )}
        </>
    );
}



