'use client';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function ExportExcel({ data }: { data: any[] }) {
  const exportToExcel = () => {
    const exportData = data.map((item) => ({
      No_SBP: item.pengiriman.no_spb || '-',
      Customer: item.pengiriman.customer,
      Berat: item.pengiriman.berat,
      Koli: item.pengiriman.koli,
      Pembayaran: item.pengiriman.pembayaran,
      Total: item.pengiriman.total,
      Jemput: item.pengiriman.jemput,
      Tujuan: item.pengiriman.tujuan,
      Provinsi: item.pengiriman.wilayah.provinsi,
      Wilayah: item.pengiriman.wilayah.wilayah,
      HargaWilayah: item.pengiriman.wilayah.harga,
      OngkosJemput: item.pengiriman.ongkos?.harga || 0,
      StatusPembayaran: item.spembayaran,
      StatusPengiriman: item.spengiriman,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'LaporanHarian');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `laporan-harian-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button
      onClick={exportToExcel}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Export ke Excel
    </button>
  );
}
