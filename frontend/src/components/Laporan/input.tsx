import axiosInstance from '@/lib/axiosInstance';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Select from 'react-select';

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

export default function LaporanForm({
    isOpen, onClose, onAddLaporan, currentUserId, mode, existingLaporan }:
    { isOpen: boolean; onClose: () => void; onAddLaporan: (laporan: any) => void; currentUserId?: string; mode?: "create" | "edit"; existingLaporan?: any; }) {

    const [tanggal, setTanggal] = useState("");
    const [bb, setBb] = useState("");

    const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});


    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && existingLaporan) {
                setTanggal(existingLaporan.tanggal || "");
                setBb(existingLaporan.bb || "");
            } else {
                // reset form
                setTanggal("");
                setBb("");
            }
        }
    }, [isOpen, mode, existingLaporan]);


    // console.log("Mengirim order dengan data:", {
    //     tanggal,
    //     bb,
    // });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            tanggal,
            bb: Number(bb),
        };

        console.log("Mengirim Laporan dengan data payload:", payload);
        try {

            if (mode === "edit" && existingLaporan?.id) {
                await axiosInstance.post(`http://localhost:2000/laporan/harian`, payload);
                setToast({ type: "success", message: "Laporan berhasil diperbarui." });
            } else {
                const response = await axiosInstance.post("http://localhost:2000/laporan/harian", payload);
                const newLaporan = response.data.data;
                setToast({ type: "success", message: "Laporan berhasil ditambahkan." });
            }


            onClose();
            onAddLaporan(payload);

        } catch (error: any) {
            console.error("Gagal menyimpan laporan:", error);
            setToast({ type: "error", message: "Gagal menyimpan laporan." });
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Tanggal Laporan</label>
                    <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">BB</label>
                    <input
                        type="text"
                        value={bb}
                        onChange={(e) => setBb(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
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