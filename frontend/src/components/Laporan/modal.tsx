// components/BulanModal.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BulanModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/laporan/harian/bulanan?bulan=${bulan}&tahun=${tahun}`);
    onClose(); // Tutup modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Pilih Bulan & Tahun</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Bulan</label>
            <select
              className="w-full border rounded p-2"
              value={bulan}
              onChange={(e) => setBulan(parseInt(e.target.value))}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} - {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm">Tahun</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={tahun}
              onChange={(e) => setTahun(parseInt(e.target.value))}
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
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Lihat Laporan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
