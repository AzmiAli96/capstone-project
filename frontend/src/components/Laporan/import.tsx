"use client";

import * as XLSX from "xlsx";

interface LaporanData {
    tanggal: string;
    bb: number;
    tkredit: number;
    tdebit: number;
    tbersih: number;
    status: {
        spembayaran: string;
        pengiriman: {
            no_spb: string;
            customer: string;
            koli: number;
            berat: number;
            Pembayaran: "debit" | "kredit";
            total: number;
            wilayah?: { harga: number };
            ongkos?: { harga: number };
        };
    }[];
}

interface ExportExcelProps {
    data: LaporanData[];
}

export default function ExportExcel({ data }: ExportExcelProps) {
    const exportToExcel = () => {
        console.log("DATA LAPORAN:", data);

        if (!data || data.length === 0) {
            alert("Data laporan kosong. Tidak ada yang bisa diekspor.");
            return;
        }

        const groupedData: { [tanggal: string]: LaporanData[] } = {};

        data.forEach((laporan) => {
            const tanggal = new Date(laporan.tanggal).toLocaleDateString("id-ID");

            if (!groupedData[tanggal]) {
                groupedData[tanggal] = [];
            }

            const status = laporan.status;

            groupedData[tanggal].push({
                tanggal,
                bb: laporan.bb,
                tkredit: laporan.tkredit,
                tdebit: laporan.tdebit,
                tbersih: laporan.tbersih,
                pembayaran: status.spembayaran,
                no_spb: status.pengiriman?.no_spb,
                customer: status.pengiriman?.customer,
                koli: status.pengiriman?.koli,
                berat: status.pengiriman?.berat,
                total: status.pengiriman?.total,
                wilayah: status.pengiriman?.wilayah?.wilayah,
                jemput: status.pengiriman?.ongkos?.jemput,
            });
        });


        const workbook = XLSX.utils.book_new();

        Object.entries(groupedData).forEach(([tanggal, entries]) => {
            if (!entries || entries.length === 0) return;

            const dateObj = new Date(entries[0].tanggal);
            const hari = dateObj.toLocaleDateString("id-ID", { weekday: "long" });
            const tanggalText = dateObj.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const bulanTahun = dateObj.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
            });

            console.log("Tanggal:", tanggal);
            console.log("Jumlah entri:", entries.length);


            const judul = `LAPORAN BARANG HARIAN GEMILANG CARGO ${bulanTahun.toUpperCase()}`;
            const totalBB = entries.reduce((acc, curr) => acc + curr.bb, 0);

            // Gabungkan semua status dari laporan harian ke dalam 1 array
            const laporanList: any[] = [];

            entries.forEach((laporan) => {
                if (Array.isArray(laporan.status)) {
                    laporan.status.forEach((statusItem) => {
                        laporanList.push({
                            tanggal: laporan.tanggal,
                            bb: laporan.bb,
                            tkredit: laporan.tkredit,
                            tdebit: laporan.tdebit,
                            tbersih: laporan.tbersih,
                            status: statusItem,
                        });
                    });
                } else if (laporan.status) {
                    // Jika ternyata hanya satu objek, tetap masukkan
                    laporanList.push({
                        tanggal: laporan.tanggal,
                        bb: laporan.bb,
                        tkredit: laporan.tkredit,
                        tdebit: laporan.tdebit,
                        tbersih: laporan.tbersih,
                        status: laporan.status,
                    });
                }
            });


            const table = laporanList.map((laporan) => {
                const item = laporan.status;

                return {
                    "No SPB": item.pengiriman?.no_spb || "-",
                    "Nama / Toko": item.pengiriman?.customer || "-",
                    "Koli": item.pengiriman?.koli ?? 0,
                    "KG": item.pengiriman?.berat ?? 0,
                    "Harga Tujuan": item.pengiriman?.wilayah?.harga ?? 0,
                    "Harga Ongkos": item.pengiriman?.ongkos?.harga ?? 0,
                    "Debit": item.pengiriman?.Pembayaran === "debit" ? item.pengiriman?.total ?? 0 : 0,
                    "Kredit": item.pengiriman?.Pembayaran === "kredit" ? item.pengiriman?.total ?? 0 : 0,
                    "Status Pembayaran": item.spembayaran || "-",
                };
            });

            if (table.length === 0) return;

            const headerKeys = Object.keys(table[0]);
            const sheetData: any[][] = [];

            sheetData.push([judul]);
            sheetData.push([]);
            sheetData.push([`Hari: ${hari}`]);
            sheetData.push([`Tanggal: ${tanggalText}`]);
            sheetData.push([`BB: ${totalBB}`]);
            sheetData.push([]);
            sheetData.push(headerKeys); // Baris header (index 6)

            table.forEach((row) => {
                const rowData = headerKeys.map((key) => (row as Record<string, any>)[key]);
                sheetData.push(rowData);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

            worksheet["!merges"] = [
                {
                    s: { r: 0, c: 0 },
                    e: { r: 0, c: headerKeys.length - 1 },
                },
            ];

            // Tambahkan border
            const borderStyle = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            };

            for (let row = 6; row < sheetData.length; row++) {
                for (let col = 0; col < headerKeys.length; col++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                    if (!worksheet[cellAddress]) continue;
                    if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
                    worksheet[cellAddress].s.border = borderStyle;
                }
            }

            XLSX.utils.book_append_sheet(workbook, worksheet, tanggal);
        });

        if (workbook.SheetNames.length === 0) {
            alert("Tidak ada data yang bisa diekspor.");
            return;
        }

        XLSX.writeFile(workbook, "laporan-harian-dengan-header.xlsx");
    };

    return (
        <button
            onClick={exportToExcel}
            style={{
                backgroundColor: "#16a34a",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginBottom: "1rem",
            }}
        >
            Export Format Laporan
        </button>
    );
}
