// "use client";

// import * as XLSX from "xlsx";

// interface Status {
//     id: string;
//     tanggal: string;
//     spembayaran: string;
//     spengiriman: string;
//     image: string;
//     pengiriman: {
//         no_spb: string;
//         customer: string;
//         koli: number;
//         berat: number;
//         Pembayaran: "debit" | "kredit";
//         total: number;
//         wilayah?: { harga: number };
//         ongkos?: { harga: number };
//     };
//     laporan: {
//         id: string;
//         tanggal: string;
//         bb: number;
//         tkredit: number;
//         tdebit: number;
//         tbersih: number;
//     }[];
// }

// interface ExportExcelProps {
//     data: Status[];
// }

// export default function ExportExcel({ data }: ExportExcelProps) {
//     const exportToExcel = () => {
//         console.log("ISI DATA DI EXPORT:", data);

//         if (!data || data.length === 0) {
//             alert("Data laporan kosong. Tidak ada yang bisa diekspor.");
//             return;
//         }

//         // Grouping berdasarkan tanggal laporan (bukan tanggal status)
//         const groupedByTanggal: Record<string, { laporan: Status["laporan"][0]; status: Status }[]> = {};

//         data.forEach((status) => {
//             if (Array.isArray(status.laporan) && status.laporan.length > 0) {
//                 status.laporan.forEach((laporan) => {
//                     const tanggal = laporan.tanggal;
//                     if (!groupedByTanggal[tanggal]) {
//                         groupedByTanggal[tanggal] = [];
//                     }
//                     groupedByTanggal[tanggal].push({ laporan, status });
//                 });
//             }
//         });

//         const workbook = XLSX.utils.book_new();

//         Object.entries(groupedByTanggal).forEach(([tanggal, items]) => {
//             const dateObj = new Date(tanggal);
//             const hari = dateObj.toLocaleDateString("id-ID", { weekday: "long" });
//             const tanggalText = dateObj.toLocaleDateString("id-ID", {
//                 day: "numeric",
//                 month: "long",
//                 year: "numeric",
//             });
//             const bulanTahun = dateObj.toLocaleDateString("id-ID", {
//                 month: "long",
//                 year: "numeric",
//             });

//             const judul = `LAPORAN BARANG HARIAN GEMILANG CARGO ${bulanTahun.toUpperCase()}`;
//             const totalBB = items.reduce((acc, item) => acc + (item.laporan.bb ?? 0), 0);

//             const table = items.map(({ laporan, status }) => {
//                 const pengiriman = status.pengiriman ?? {};
//                 return {
//                     "No SPB": pengiriman?.no_spb ?? "-",
//                     "Nama / Toko": pengiriman?.customer ?? "-",
//                     "Koli": pengiriman?.koli ?? 0,
//                     "KG": pengiriman?.berat ?? 0,
//                     "Harga Tujuan": pengiriman?.wilayah?.harga ?? 0,
//                     "Harga Ongkos": pengiriman?.ongkos?.harga ?? 0,
//                     "Debit": pengiriman?.Pembayaran === "debit" ? pengiriman?.total ?? 0 : 0,
//                     "Kredit": pengiriman?.Pembayaran === "kredit" ? pengiriman?.total ?? 0 : 0,
//                     "Status Pembayaran": status.spembayaran ?? "-",
//                 };
//             });

//             if (table.length === 0) return; // skip jika kosong

//             const headerKeys = Object.keys(table[0]);
//             const sheetData: any[][] = [];

//             sheetData.push([judul]);
//             sheetData.push([]);
//             sheetData.push([`Hari: ${hari}`]);
//             sheetData.push([`Tanggal: ${tanggalText}`]);
//             sheetData.push([`BB: ${totalBB}`]);
//             sheetData.push([]);
//             sheetData.push(headerKeys);

//             table.forEach((row) => {
//                 const rowData = headerKeys.map((key) => (row as Record<string, any>)[key]);
//                 sheetData.push(rowData);
//             });

//             const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//             worksheet["!merges"] = [
//                 {
//                     s: { r: 0, c: 0 },
//                     e: { r: 0, c: headerKeys.length - 1 },
//                 },
//             ];

//             XLSX.utils.book_append_sheet(workbook, worksheet, tanggal);
//         });

//         if (workbook.SheetNames.length === 0) {
//             alert("Tidak ada data yang bisa diekspor.");
//             return;
//         }

//         XLSX.writeFile(workbook, "laporan-harian-gemilang.xlsx");
//     };


//     return (
//         <button
//             onClick={exportToExcel}
//             style={{
//                 backgroundColor: "#16a34a",
//                 color: "#fff",
//                 padding: "8px 16px",
//                 border: "none",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//                 marginBottom: "1rem",
//             }}
//         >
//             Export Format Laporan
//         </button>
//     );
// }

