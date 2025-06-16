"use client";
import { useState } from "react";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function ExportLaporanModal({ show, onClose }: Props) {
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
          for (let C = 0; C <= 11; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = worksheet[cellAddress];
            if (cell) {
              cell.s = {
                border: {
                  top: { style: "thin", color: { rgb: "000000" } },
                  bottom: { style: "thin", color: { rgb: "000000" } },
                  left: { style: "thin", color: { rgb: "000000" } },
                  right: { style: "thin", color: { rgb: "000000" } },
                },
                ...(C >= 2 && C <= 11 ? { alignment: { horizontal: "center", vertical: "center" } } : {})
              };
            }
          }
        }

        worksheet["!ref"] = XLSX.utils.encode_range({
          s: { r: 0, c: 0 },
          e: { r: range.e.r + 1, c: range.e.c }
        });

        worksheet["!cols"] = [
          { wch: 12 }, // No_SPB
          { wch: 20 }, // Customer
          { wch: 6 },  // Koli
          { wch: 6 },  // KG
          { wch: 10 }, // Harga
          { wch: 10 }, // Ongkos
          { wch: 15 }, // Kredit
          { wch: 15 }, // Debit
          { wch: 15 }, // Total
          { wch: 15 }, // Tujuan
          { wch: 15 }, // Jemput
          { wch: 15 }, // Status
        ];

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

  if (!show) return null;

  return (
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
              onClick={onClose}
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
  );
}