import axiosInstance from '@/lib/axiosInstance';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // Handle click outside to close
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex justify-center items-center"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Order Form</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-4 text-gray-800 dark:text-gray-200-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function OrderForm({
    isOpen, onClose, onAddOrder, currentUserId, mode, existingOrder }:
    { isOpen: boolean; onClose: () => void; onAddOrder: (order: any) => void; currentUserId?: string; mode?: "create" | "edit"; existingOrder?: any; }) {

    const [berat, setBerat] = useState<number | "">("");
    const [koli, setKoli] = useState("");
    const isJemputEnabled = typeof berat === 'number' && berat > 500;
    const [pembayaran, setPembayaran] = useState("cash");
    const [jemput, setJemput] = useState("");
    const [tujuan, setTujuan] = useState("");
    const [ket, setKet] = useState("");
    const [image, setImage] = useState("");
    const [customer, setCustomer] = useState("");
    const [no_spb, setNo_spb] = useState("");

    // State for the data lists
    const [wilayahList, setWilayahList] = useState<any[]>([]);
    const [ongkosList, setOngkosList] = useState<any[]>([]);
    const [selectedWilayah, setSelectedWilayah] = useState("");
    const [selectedOngkos, setSelectedOngkos] = useState("");

    // Filtered costs based on selected wilayah
    const [filteredCosts, setFilteredCosts] = useState([]);
    const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});


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

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && existingOrder) {
                setBerat(existingOrder.berat || "");
                setKoli(existingOrder.koli || "");
                setPembayaran(existingOrder.pembayaran || "cash");
                setJemput(existingOrder.jemput || "");
                setTujuan(existingOrder.tujuan || "");
                setKet(existingOrder.ket || "");
                setImage(existingOrder.image || "");
                setCustomer(existingOrder.customer || "");
                setNo_spb(existingOrder.no_spb || "");
                setSelectedWilayah(existingOrder.id_wilayah?.toString() || "");
                setSelectedOngkos(existingOrder.id_ongkos?.toString() || "");
                // setSelectedFile(existingOrder.image?.toString() || "");
            } else {
                // reset form
                setBerat("");
                setKoli("");
                setPembayaran("cash");
                setTujuan("");
                setJemput("");
                setKet("");
                setImage("");
                setCustomer("");
                setNo_spb("");
                setSelectedWilayah("");
                setSelectedOngkos("");
                setSelectedFile(null);
            }
        }
    }, [isOpen, mode, existingOrder]);


    // console.log("Mengirim order dengan data:", {
    //     customer,
    //     berat,
    //     koli,
    //     pembayaran,
    //     ket,
    //     tujuan,
    //     jemput,
    //     id_ongkos: selectedOngkos,
    //     id_wilayah: selectedWilayah,
    //     id_user: currentUserId
    // });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = {
            no_spb: !no_spb,
            berat: berat === "",
            koli: !koli,
            selectedWilayah: !selectedWilayah,
            tujuan: !tujuan
        };

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            alert("Mohon lengkapi semua kolom yang wajib diisi.");
            setToast({ type: "warning", message: "Form belum lengkap. Mohon isi semua kolom." });
            return;
        }

        if (!currentUserId || currentUserId === "0") {
            console.warn("User belum login atau ID tidak valid:", currentUserId);
            setToast({ type: "warning", message: "User belum login. Silakan coba lagi." });
            return;
        }

        const isBeratValidForJemput = Number(berat) >= 500;
        
        const basePayload = {
            no_spb,
            customer,
            berat,
            koli,
            pembayaran,
            ket,
            tujuan,
            jemput: isBeratValidForJemput
                ? (isJemputEnabled ? jemput.trim() : "Antar Sendiri")
                : null,
            tanggal: new Date().toISOString(),
            id_ongkos: isBeratValidForJemput
                ? (selectedOngkos === "" ? null : Number(selectedOngkos))
                : null,
            id_wilayah: Number(selectedWilayah)
        };

        const payload = mode === "edit"
            ? basePayload
            : { ...basePayload, id_user: Number(currentUserId) };

        console.log("Mengirim order dengan data payload:", payload);
        try {
            let newOrderId: number | null = null;

            if (mode === "edit" && existingOrder?.id) {
                await axiosInstance.put(`http://localhost:2000/order/${existingOrder.id}`, payload);
                newOrderId = existingOrder.id;
                setToast({ type: "success", message: "Order berhasil diperbarui." });
            } else {
                const response = await axiosInstance.post("http://localhost:2000/order", payload);
                const newOrder = response.data.data;
                newOrderId = newOrder.id;
                setToast({ type: "success", message: "Order berhasil ditambahkan." });
            }

            if (selectedFile && newOrderId) {
                await uploadImage(newOrderId);
            }

            onClose();
            onAddOrder(payload);

        } catch (error: any) {
            console.error("Gagal menyimpan order:", error);
            setToast({ type: "error", message: "Gagal menyimpan order." });
        }
    };

    useEffect(() => {
        if (!isJemputEnabled) {
            setSelectedOngkos("");
            setJemput(""); // optional reset
        }
    }, [isJemputEnabled]);

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
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">No SPB</label>
                    <input
                        type="text"
                        value={no_spb}
                        onChange={(e) => setNo_spb(e.target.value)}
                        className={`border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white 
                            ${errors.no_spb ? "border-red-500" : "dark:border-gray-700"
                            }`}
                        required
                    />
                </div>
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
                        className={`border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white 
                            ${errors.berat ? "border-red-500" : "dark:border-gray-700"
                            }`}
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
                        className={`border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white 
                            ${errors.koli ? "border-red-500" : "dark:border-gray-700"
                            }`}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Tujuan</label>
                    <select
                        value={selectedWilayah}
                        onChange={(e) => setSelectedWilayah(e.target.value)}
                        className={`border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white 
                            ${errors.selectedWilayah ? "border-red-500" : "dark:border-gray-700"
                            }`}
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
                        className={`border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white 
                            ${errors.tujuan ? "border-red-500" : "dark:border-gray-700"
                            }`}
                        required
                    />
                </div>

                {/* Jemput selection from cost table */}
                <div className="grid grid-cols-2 items-start gap-4">
                    <label className="text-gray-700 dark:text-gray-300">
                        Jemput
                        {!isJemputEnabled && berat !== '' && (
                            <span className="text-red-600 ml-2 font-bold">!</span>
                        )}
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

                <div className="mt-4 flex justify-end space-x-2">
                    <div className="flex justify-between items-center mt-4 w-full">
                        <div>
                            {/* Removed total calculation */}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 mr-2"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}