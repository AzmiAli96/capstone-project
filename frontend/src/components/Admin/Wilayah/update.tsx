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
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Update Wilayah</h3>
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

export default function UpdateWilayahForm({ isOpen, onClose, onUpdateWilayah, wilayah, }: { isOpen: boolean; onClose: () => void; onUpdateWilayah: (wilayah: any) => void; wilayah: any; }) {
    const [provinsi, setProvinsi] = useState("");
    const [namaWilayah, setNamaWilayah] = useState("");
    const [harga, setHarga] = useState("");
    const [update, setUpdate] = useState("");

    useEffect(() => {
        if (wilayah) {
            setProvinsi(wilayah.provinsi || "");
            setNamaWilayah(wilayah.wilayah || "");
            setHarga(wilayah.harga || "");
        }
    }, [wilayah]);

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const updatedWilayah = {
                provinsi,
                wilayah: namaWilayah,
                harga: parseFloat(harga),
            };

            const response = await axiosInstance.put(
                `/wilayah/${wilayah.id}`, // pastikan wilayah punya ID
                updatedWilayah,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            onUpdateWilayah(response.data); // callback untuk update list
            onClose();
        } catch (error) {
            console.error("Gagal mengupdate wilayah", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleUpdate}>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Provinsi</label>
                    <input
                        type="text"
                        value={provinsi}
                        onChange={(e) => setProvinsi(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Wilayah</label>
                    <input
                        type="text"
                        value={namaWilayah}
                        onChange={(e) => setNamaWilayah(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Harga</label>
                    <input
                        type="number"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
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