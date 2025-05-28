import axiosInstance from '@/lib/axiosInstance';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, FormEvent } from 'react';

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
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Update User</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-4 text-gray-800 dark:text-gray-200">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function UpdateStatusForm({ isOpen, onClose, onUpdateStatus, status, }: { isOpen: boolean; onClose: () => void; onUpdateStatus: (status: any) => void; status: any; }) {
    const [spengiriman, setSpengiriman] = useState("");
    const [spembayaran, setSpembayaran] = useState("");
    const [image, setImage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (status) {
            setSpembayaran(status.spembayaran || "");
            setSpengiriman(status.spengiriman || "");
            setImage(status.image || "");
            setSelectedFile(status.selectedFile || "");
        }
    }, [status]);

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let uploadedImagePath = image; // pakai image lama kalau tidak upload baru

            // Jika ada file baru, upload dulu
            if (selectedFile) {
                const formData = new FormData();
                formData.append("image", selectedFile);
                formData.append("id", status.id.toString());

                const response = await fetch("http://localhost:2000/status/upload", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    uploadedImagePath = result.data; // path image dari server
                    console.log("Uploaded image path:", uploadedImagePath);
                    setImage(uploadedImagePath);
                } else {
                    console.error("Gagal upload:", result.error);
                    alert(`Upload gagal: ${result.error}`);
                    return;
                }
            }

            // Sekarang update status
            const updatedStatus = {
                spengiriman,
                spembayaran,
                image: uploadedImagePath, // kirim path image ke backend
            };

            console.log("Mengirim update status dengan:", updatedStatus);

            const response = await axiosInstance.put(
                `http://localhost:2000/status/${status.id}`,
                updatedStatus,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            onUpdateStatus(response.data);
            onClose();
        } catch (error) {
            console.error("Gagal mengupdate status", error);
            alert("Gagal mengupdate status");
        }
    };

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setImage(e.target.files[0].name); // Store the filename in the state
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleUpdate}>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Status Pengiriman</label>
                    <select
                        value={spengiriman}
                        onChange={(e) => setSpengiriman(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    >
                        {spengiriman === "" && (
                            <option value="">Pilih Status Pengiriman</option>
                        )}
                        <option value="Pending">Pending</option>
                        <option value="Jemput Barang">Jemput Barang</option>
                        <option value="Menuju Tujuan">Menuju Tujuan</option>
                        <option value="Sampai Tujuan">Sampai Tujuan</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Status Pembayaran</label>
                    <select
                        value={spembayaran}
                        onChange={(e) => setSpembayaran(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    >
                        {spembayaran === "" && (
                            <option value="">Pilih Status Pembayaran</option>
                        )}
                        <option value="Belum dibayar">Belum Dibayar</option>
                        <option value="Lunas">Lunas</option>
                    </select>
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

                {/* Submit button */}
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-green-300 dark:bg-gray-700 dark:text-white dark:hover:bg-green-600"
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
            </form>
        </Modal>
    );
}