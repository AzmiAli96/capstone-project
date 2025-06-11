// "use client"
// import React, { useEffect, useState } from "react";
// import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
// import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
// import Toast from "@/components/Toast";
// import axiosInstance from "@/lib/axiosInstance";
// import LaporanForm from "./input";
// import { Recycle, RefreshCw, Trash2 } from "lucide-react";
// import ExportExcel from "./import";

// export default function Laporan() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [items, setItems] = useState<any[]>([]);
//     const [selectedLaporan, setSelectedLaporan] = useState(null);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [page, setPage] = useState(1);
//     const [perPage] = useState(10);
//     const [total, setTotal] = useState(0);
//     const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);


//     const openModal = () => setIsModalOpen(true);
//     const closeModal = () => setIsModalOpen(false);
//     const openEditModal = () => setIsEditModalOpen(true);
//     const closeEditModal = () => setIsEditModalOpen(false);

//     const [selectedLaporanId, setSelectedOrderId] = useState<string | null>(null);

//     // get semua data wilayah + search
//     const fetchLaporan = async () => {
//         try {
//             const response = await axiosInstance.get("http://localhost:2000/laporan", {
//                 params: {
//                     search: searchQuery,
//                     page,
//                     perPage,
//                 },
//                 withCredentials: true,
//             });

//             setItems(response.data.data);
//             setTotal(response.data.total);
//         } catch (error) {
//             console.error("Gagal mengambil data laporan:", error);
//             setToast({ type: "error", message: "Gagal mengambil data laporan." });
//         }
//     };

//     useEffect(() => {
//         fetchLaporan();
//     }, [page, searchQuery]);

//     useEffect(() => {
//         console.log("ITEMS YANG DIKIRIM KE EXPORT:", items);
//     }, [items]);

//     //Search
//     const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setPage(1);
//         fetchLaporan();
//     };

//     const closeToast = () => setToast(null);

//     // Delete
//     const handleDelete = async (id: number) => {
//         console.log("Menghapus Laporan dengan ID:", id); // Debug

//         try {
//             const token = localStorage.getItem("token");

//             await axiosInstance.delete(`http://localhost:2000/laporan/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             setItems((prev) => prev.filter((wilayah) => wilayah.id !== id));
//             setToast({ type: "success", message: "Laporan berhasil Dihapus." });
//         } catch (error: any) {
//             console.log("Gagal menghapus Laporan:", error.response?.data || error.message);
//             setToast({ type: "error", message: "Gagal menghapus Laporan." });
//         }
//     };



//     return (
//         <>
//             {/* Search & Button */}
//             <div className="flex justify-between items-center w-full mb-4">
//                 <form className="w-full max-w-md" onSubmit={handleSearch}>
//                     <div className="relative">
//                         <input
//                             type="text"
//                             placeholder="Search Here..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-6 py-3 shadow focus:border-blue-500 focus:outline-none"
//                         />
//                         <button
//                             type="submit"
//                             className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500"
//                             aria-label="search-icon"
//                         >
//                             <MagnifyingGlassCircleIcon className="h-6 w-6" />
//                         </button>
//                     </div>
//                 </form>

//                 <ExportExcel data={items} />

//                 <button
//                     onClick={openModal}
//                     className="ml-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//                 >
//                     Buat Laporan Baru
//                 </button>
//                 <LaporanForm
//                     isOpen={isModalOpen}
//                     onClose={closeModal}
//                     mode="create"
//                     onAddLaporan={(laporan: any) => {
//                         setItems((prev) => [...prev, laporan]);
//                         setToast({ type: "success", message: "Laporan berhasil ditambahkan." });
//                     }}
//                 />
//             </div>

//             {/* Table */}
//             <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/70">
//                 <div className="max-w-full overflow-x-auto">
//                     <div className="min-w-[1100px]">
//                         <Table>
//                             <TableHeader className="bg-gray-100 dark:bg-gray-800">
//                                 <TableRow>
//                                     <TableCell isHeader>No</TableCell>
//                                     <TableCell isHeader>Tanggal</TableCell>
//                                     <TableCell isHeader>BB</TableCell>
//                                     <TableCell isHeader>Total Kredit</TableCell>
//                                     <TableCell isHeader>Total Debit</TableCell>
//                                     <TableCell isHeader>Total Bersih</TableCell>
//                                     <TableCell isHeader>Action</TableCell>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {Array.isArray(items) && items.map((item, index) => (
//                                     <TableRow key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
//                                         <TableCell>{index + 1}</TableCell>
//                                         <TableCell>{new Date(item.tanggal).toLocaleDateString("id-ID", {
//                                             day: "2-digit",
//                                             month: "long",
//                                             year: "numeric",
//                                         })}</TableCell>
//                                         <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.bb)}</TableCell>
//                                         <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.tkredit)}</TableCell>
//                                         <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.tdebit)}</TableCell>
//                                         <TableCell>Rp {new Intl.NumberFormat('id-ID').format(item.tbersih)}</TableCell>
//                                         <TableCell>
//                                             <button
//                                                 className="bg-green-600 hover:bg-blue-700 text-white hover:underline py-1 px-3 rounded"
//                                                 onClick={() => { setSelectedLaporan(item); openEditModal(); }}
//                                             >
//                                                 <RefreshCw size={20} />
//                                             </button>
//                                             <button
//                                                 className="ml-2 bg-red-600 text-white text-white py-1 px-3 rounded hover:underline"
//                                                 onClick={() => {
//                                                     if (confirm("Yakin ingin menghapus wilayah ini?")) {
//                                                         handleDelete(item.id);
//                                                     }
//                                                 }}
//                                             >
//                                                 <Trash2 size={20} />
//                                             </button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 </div>
//             </div>
//             <nav aria-label="Page navigation" className="flex justify-center mt-6">
//                 <ul className="inline-flex -space-x-px text-sm">
//                     <li>
//                         <button
//                             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                             disabled={page === 1}
//                             className="flex items-center justify-center px-3 h-8 ms-0 leading-tight 
//               text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border border-e-0 
//               border-gray-300 dark:border-gray-700 rounded-s-lg hover:bg-gray-100 
//               dark:hover:bg-gray-700 disabled:opacity-50"
//                         >
//                             Previous
//                         </button>
//                     </li>

//                     {Array.from({ length: Math.ceil(total / perPage) }, (_, index) => (
//                         <li key={index}>
//                             <button
//                                 onClick={() => setPage(index + 1)}
//                                 className={`flex items-center justify-center px-3 h-8 leading-tight border ${page === index + 1
//                                     ? "text-blue-600 border-gray-300 bg-blue-50 dark:bg-gray-700 dark:text-blue-400"
//                                     : "text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
//                                     }`}
//                             >
//                                 {index + 1}
//                             </button>
//                         </li>
//                     ))}

//                     <li>
//                         <button
//                             onClick={() => {
//                                 const maxPage = Math.ceil(total / perPage);
//                                 if (page < maxPage) setPage(page + 1);
//                             }}
//                             disabled={page >= Math.ceil(total / perPage)}
//                             className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 
//               dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 
//               dark:border-gray-700 rounded-e-lg hover:bg-gray-100 dark:hover:bg-gray-700 
//               disabled:opacity-50"
//                         >
//                             Next
//                         </button>
//                     </li>
//                 </ul>
//             </nav>
//             <LaporanForm
//                 isOpen={isEditModalOpen}
//                 onClose={closeEditModal}
//                 mode="edit"
//                 existingLaporan={selectedLaporan}
//                 onAddLaporan={(updatedLaporan: any) => {
//                     setItems((prev) =>
//                         prev.map((item) => (item.id === updatedLaporan.id ? updatedLaporan : item))
//                     );
//                     setToast({ type: "success", message: "Laporan berhasil diupdate." });
//                 }}
//             />
//             {toast && (
//                 <Toast type={toast.type} message={toast.message} onClose={closeToast} />
//             )}
//         </>
//     );
// }

"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



export default function ExportLaporanModal() {
    const [showModal, setShowModal] = useState(false);
    const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1);
    const [tahun, setTahun] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState(false);

    const handleExport = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:2000/laporan/harian/bulanan?bulan=${bulan}&tahun=${tahun}`,
                {
                    credentials: "include",
                }
            );
            const data = await res.json();

            if (!Array.isArray(data)) {
                alert("Data tidak valid.");
                return;
            }

            console.log("Data dari backend:", data);

            // Kelompokkan data berdasarkan tanggal (format lokal agar rapi)
            const groupedByDate: Record<string, any[]> = {};
            const totalsByDate: Record<string, { kredit: number; debit: number; total: number }> = {};

            data.forEach((item: any) => {
                const dateKey = new Date(item.tanggal).toISOString().split("T")[0];
                if (!groupedByDate[dateKey]) {
                    groupedByDate[dateKey] = [];
                    totalsByDate[dateKey] = { kredit: 0, debit: 0, total: 0 };
                }

                const pembayaran = item.pengiriman?.pembayaran;
                const totalVal = Number(item.pengiriman?.total || 0);
                const isKredit = pembayaran === "kredit";
                const isDebit = pembayaran === "debit";

                const formatRupiah = (value: number | string) => {
                    const number = Number(value);
                    return isNaN(number) ? "-" : `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
                };

                groupedByDate[dateKey].push({
                    No_SPB: item.pengiriman?.no_spb || "customer",
                    Customer: item.pengiriman?.customer || "-",
                    Koli: item.pengiriman?.koli || "-",
                    KG: item.pengiriman?.berat || "-",
                    Harga: formatRupiah(item.pengiriman?.wilayah?.harga) || "-",
                    Ongkos: formatRupiah(item.pengiriman?.ongkos?.harga) || "0",
                    Kredit: isKredit ? formatRupiah(totalVal) : "-",
                    Debit: isDebit ? formatRupiah(totalVal) : "-",
                    Total: formatRupiah(totalVal) || "-",
                    Tujuan: item.pengiriman?.tujuan || "-",
                    Jemput: item.pengiriman?.jemput || "-",
                    Status: item.spembayaran || "-",
                });
                if (isKredit) totalsByDate[dateKey].kredit += totalVal;
                if (isDebit) totalsByDate[dateKey].debit += totalVal;
                totalsByDate[dateKey].total += totalVal;
            });

            // Buat workbook dan tambah sheet untuk setiap tanggal
            const workbook = XLSX.utils.book_new();

            Object.entries(groupedByDate).forEach(([tanggal, items]) => {
                const totals = totalsByDate[tanggal];

                // Tambahkan baris total
                items.push({
                    No_SPB: "TOTAL",
                    Customer: "",
                    Koli: "",
                    KG: "",
                    Harga: "",
                    Ongkos: "",
                    Kredit: `Rp ${new Intl.NumberFormat("id-ID").format(totals.kredit)}`,
                    Debit: `Rp ${new Intl.NumberFormat("id-ID").format(totals.debit)}`,
                    Total: `Rp ${new Intl.NumberFormat("id-ID").format(totals.total)}`,
                    Tujuan: "",
                    Jemput: "",
                    Status: "",
                });

                const worksheet = XLSX.utils.json_to_sheet(items);

                const headers = [
                    "No_SPB", "Customer", "Koli", "KG", "Harga", "Ongkos",
                    "Kredit", "Debit", "Total", "Tujuan", "Jemput", "Status"
                ];

                headers.forEach((header, i) => {
                    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
                    worksheet[cellAddress] = {
                        v: header,
                        t: "s",
                        s: {
                            font: { bold: true },
                            alignment: { horizontal: "center", vertical: "center" },
                            fill: { fgColor: { rgb: "D9D9D9" } },
                            border: {
                                top: { style: "thin", color: { rgb: "000000" } },
                                bottom: { style: "thin", color: { rgb: "000000" } },
                                left: { style: "thin", color: { rgb: "000000" } },
                                right: { style: "thin", color: { rgb: "000000" } },
                            }
                        }
                    };
                });

                // Tambahkan border & align center pada semua kolom dari Koli sampai Status
                const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
                for (let R = 1; R <= range.e.r; ++R) {
                    for (let C = 2; C <= 11; ++C) {
                        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                        const cell = worksheet[cellAddress];
                        if (cell) {
                            cell.s = {
                                alignment: { horizontal: "center", vertical: "center" },
                                border: {
                                    top: { style: "thin", color: { rgb: "000000" } },
                                    bottom: { style: "thin", color: { rgb: "000000" } },
                                    left: { style: "thin", color: { rgb: "000000" } },
                                    right: { style: "thin", color: { rgb: "000000" } },
                                }
                            };
                        }
                    }
                }

                worksheet["!ref"] = XLSX.utils.encode_range({
                    s: { r: 0, c: 0 },
                    e: { r: range.e.r + 1, c: range.e.c }
                });

                XLSX.utils.book_append_sheet(workbook, worksheet, tanggal);
            });

            const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(blob, `Laporan-${bulan}-${tahun}.xlsx`);
            setShowModal(false);
        } catch (error) {
            console.error("Gagal eksport:", error);
            alert("Gagal mengekspor data.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6">
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Export Laporan Bulanan
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Export Laporan Bulanan</h2>
                        <form onSubmit={handleExport} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Bulan</label>
                                <select
                                    value={bulan}
                                    onChange={(e) => setBulan(Number(e.target.value))}
                                    className="w-full border rounded p-2"
                                >
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i} value={i + 1}>
                                            {i + 1} - {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Tahun</label>
                                <input
                                    type="number"
                                    value={tahun}
                                    onChange={(e) => setTahun(Number(e.target.value))}
                                    className="w-full border rounded p-2"
                                    min={2000}
                                    max={2100}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    {loading ? "Mengekspor..." : "Export"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

