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
                <div className="flex justify-between items-center p-4 bstatus-b bstatus-gray-200 dark:bstatus-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Informasi Status</h3>
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

interface StatusInfoProps {
    isOpen: boolean;
    onClose: () => void;
    statusId: string | null;
}

export default function StatusInfo({ isOpen, onClose, statusId }: StatusInfoProps) {
    const [item, setItem] = useState<any>(null);

    const fetchStatusById = async () => {
        try {
            const response = await axiosInstance.get(`http://localhost:2000/status/${statusId}`, {
                withCredentials: true,
            });

            console.log("Status fetched:", response.data);
            setItem(response.data);
        } catch (error) {
            console.error("Gagal mengambil data status:", error);
        }
    };
    console.log("ITEM:", item);

    useEffect(() => {
        if (isOpen && statusId) {
            fetchStatusById();
        }
    }, [isOpen, statusId]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {/* <h1>Tampilan Modal Info</h1> */}
            {item && (
                <div
                    key={item.id}
                    className="bstatus-b bstatus-gray-300 dark:bstatus-gray-700 py-4 space-y-2"
                >
                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <span className="text-gray-900 dark:text-white">
                            {item.pengiriman?.user?.name}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Berat Barang</label>
                        <span className="text-gray-900 dark:text-white">{item.pengiriman?.berat} KG</span>
                    </div>

                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Koli / Jumlah Barang</label>
                        <span className="text-gray-900 dark:text-white">{item.pengiriman?.koli}</span>
                    </div>

                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Alamat Tujuan</label>
                        <span className="text-gray-900 dark:text-white">{item.pengiriman?.tujuan}</span>
                    </div>

                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Alamat Jemput</label>
                        <span className="text-gray-900 dark:text-white">
                            {item.pengiriman?.jemput ? item.pengiriman?.jemput : "Jemput sendiri"}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Pembayaran</label>
                        <span className="text-gray-900 dark:text-white">{item.pengiriman?.pembayaran}</span>
                    </div>

                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
                        <span className="text-gray-900 dark:text-white">
                            {new Date(item.pengiriman?.tanggal).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Keterangan</label>
                        <span className="text-gray-900 dark:text-white">{item.pengiriman?.ket}</span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Status Pengiriman</label>
                        <span className="text-gray-900 dark:text-white">
                            {item.spengiriman}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Status Pengiriman</label>
                        <span className="text-gray-900 dark:text-white">
                            {item.spembayaran}
                        </span>
                    </div>
                    {item?.image && (
                        <div className="grid grid-cols-2 items-center gap-4 mt-4">
                            <label className="text-gray-700 dark:text-gray-300">Gambar</label>
                            <img
                                src={`http://localhost:2000${item.image}`}
                                alt="Status Image"
                                className="w-40 h-auto bstatus rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:bstatus-gray-700"
                            />
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}