"use client"
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Toast from "@/components/Toast";

export default function OrderForm() {
  const [berat, setBerat] = useState<number | "">("");
  const [koli, setKoli] = useState("");
  const isJemputEnabled = typeof berat === 'number' && berat > 500;
  const [pembayaran, setPembayaran] = useState("cash"); // Default to cash
  const [jemput, setJemput] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [ket, setKet] = useState("");
  const [image, setImage] = useState("");
  const [customer, setCustomer] = useState("");
  const [no_spb, setNo_spb] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // State for the data lists
  const [wilayahList, setWilayahList] = useState<any[]>([]);
  const [ongkosList, setOngkosList] = useState<any[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState("");
  const [selectedOngkos, setSelectedOngkos] = useState("");

  // Filtered costs based on selected wilayah
  const [filteredCosts, setFilteredCosts] = useState([]);
  const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

  // Fetch wilayah data
  useEffect(() => {
    axiosInstance.get("/wilayah")
      .then((res) => {
        console.log("Data wilayah:", res.data.data); 
        setWilayahList(res.data.data);
      })
      .catch((err) => {
        console.error("Gagal fetch wilayah:", err);
      });
  }, []);

  // Fetch cost data
  useEffect(() => {
    axiosInstance.get("/cost").then((res) => {
      console.log("Data Cost:", res.data.data); 
      setOngkosList(res.data.data);
    })
      .catch((err) => {
        console.error("Gagal fetch wilayah:", err);
      });
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/getUser");
        const data = await res.json();
        if (data?.user?.id) {
          setCurrentUserId(data.user.id); 
          console.log("User login ID:", data.user.id);
        } else {
          console.warn("User ID tidak ditemukan dalam token.");
        }
      } catch (err) {
        console.error("Gagal mendapatkan user dari token", err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    setNo_spb("customer");
    setBerat("");
    setKoli("");
    setPembayaran("cash");
    setTujuan("");
    setJemput("");
    setKet("");
    setImage("");
    setCustomer("");
    setSelectedWilayah("");
    setSelectedOngkos("");
  }, []);

  // console.log("Mengirim order dengan data:", {
  //   berat,
  //   koli,
  //   pembayaran,
  //   id_ongkos: selectedOngkos,
  //   id_wilayah: selectedWilayah,
  //   id_user: currentUserId
  // });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      console.warn("User belum login atau ID tidak valid:", currentUserId);
      setToast({ type: "warning", message: "User belum login. Silakan coba lagi." });
      return;
    }

    try {
      const payload = {
        customer,
        berat,
        koli,
        pembayaran,
        ket,
        tujuan,
        jemput,
        tanggal: new Date().toISOString(),
        id_ongkos: selectedOngkos === "" ? null : Number(selectedOngkos),
        id_wilayah: Number(selectedWilayah),
        id_user: Number(currentUserId),
      };

      console.log("Mengirim order dengan data payload:", payload);

      // Kirim data order
      const response = await axiosInstance.post("http://localhost:2000/order", payload);
      const newOrder = response.data.data;

      const newOrderId = newOrder?.id;
      if (!newOrderId) throw new Error("ID order tidak ditemukan setelah insert");

      // Upload gambar jika ada
      if (selectedFile) {
        await uploadImage(newOrderId);
      }

      setToast({ type: "success", message: "Order berhasil ditambahkan." });

      resetForm();

    } catch (error: any) {
      console.error("Gagal menambahkan order:", error);
      console.error("Detail error:", error.response?.data);
      setToast({ type: "error", message: "Gagal menambahkan order." });
    }
  };

  const resetForm = () => {
    setBerat("");
    setKoli("");
    setPembayaran("cash");
    setJemput("");
    setTujuan("");
    setKet("");
    setCustomer("");
    setSelectedWilayah("");
    setSelectedOngkos("");
    setImage("");
    setSelectedFile(null);
  };

  const closeToast = () => setToast(null);

  // Handle file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImage(e.target.files[0].name); 
    }
  };

  const uploadImage = async (orderId: number) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("id", orderId.toString());

    try {
      const response = await fetch("http://localhost:2000/order/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Uploaded image path:", result.data);
        setImage(result.data); 
      } else {
        alert(`Upload gagal: ${result.error}`);
      }

    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat upload.");
    }
  };

  return (
    <div className="min-h-screen bg-[#e3eaf2] flex items-center justify-center py-10 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order</h2>
          <Link href="/dashboard">
            <button className="border border-gray-400 rounded-full px-4 py-1 hover:bg-gray-100">
              Back
            </button>
          </Link>
        </div>

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Nama Customer</label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Berat (Kg)</label>
            <input
              type="number"
              className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              value={berat}
              onChange={(e) =>
                setBerat(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Koli / Jumlah Barang</label>
            <input
              type="text"
              value={koli}
              onChange={(e) => setKoli(e.target.value)}
              className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Tujuan</label>
            <select
              value={selectedWilayah}
              onChange={(e) => setSelectedWilayah(e.target.value)}
            >
              <option value="">Pilih tujuan</option>
              {Array.isArray(wilayahList) && wilayahList.map((wilayah: any) => (
                <option key={wilayah.id} value={wilayah.id}>
                  {wilayah.wilayah}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Alamat Tujuan</label>
            <input
              type="text"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              required
            />
          </div>

          {/* Jemput selection from cost table */}
          <div className="grid grid-cols-2 items-start gap-4">
            <label className="text-gray-700 dark:text-gray-300">
              Jemput
            </label>
            <div className="w-full">
              <select
                value={selectedOngkos}
                onChange={(e) => setSelectedOngkos(e.target.value)}
                disabled={!isJemputEnabled}
                className="w-full border rounded px-2 py-1 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Pilih lokasi jemput</option>
                {Array.isArray(ongkosList) &&
                  ongkosList.map((ongkos: any) => (
                    <option key={ongkos.id} value={ongkos.id}>
                      {ongkos.jemput}
                    </option>
                  ))}
              </select>

              <p className="text-sm text-gray-500 mt-1">
                Jemput hanya tersedia jika berat barang lebih dari 500.
              </p>
            </div>
          </div>


          {/* Alamat Jemput */}
          <div className="grid grid-cols-2 items-start gap-4">
            <label className="text-gray-700 dark:text-gray-300">Alamat Jemput</label>
            <input
              type="text"
              value={jemput}
              onChange={(e) => setJemput(e.target.value)}
              className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              disabled={!isJemputEnabled}
              required={isJemputEnabled}
            />
          </div>

          <div className="grid grid-cols-2 items-start gap-4">
            <label className="text-gray-700 dark:text-gray-300">Pembayaran</label>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pembayaran"
                  value="cash"
                  checked={pembayaran === "cash"}
                  onChange={() => setPembayaran("cash")}
                />
                Cash
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pembayaran"
                  value="credit"
                  checked={pembayaran === "credit"}
                  onChange={() => setPembayaran("credit")}
                />
                Credit
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 items-start gap-4">
            <label className="text-gray-700 dark:text-gray-300">Keterangan</label>
            <textarea
              rows={3}
              value={ket}
              onChange={(e) => setKet(e.target.value)}
              className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700" />
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Gambar (Image)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300"></label>
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span>Total</span>
              <input type="text" className="border px-2 py-1 w-32 text-right" readOnly />
            </div>
            <button
              type="submit"
              className="bg-white border border-gray-400 rounded-full px-6 py-1 hover:bg-gray-100"
            >
              Order
            </button>
          </div>
        </form>
      </div>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={closeToast}
        />
      )}
    </div>
  );
}
