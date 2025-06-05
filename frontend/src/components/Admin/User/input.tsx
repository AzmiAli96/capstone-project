import Toast from '@/components/Toast';
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
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Create User</h3>
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

export default function InputUserForm({ isOpen, onClose, onAddUser, }: { isOpen: boolean; onClose: () => void; onAddUser: (user: any) => void; }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alamat, setAlamat] = useState("");
    const [no_hp, setNo_hp] = useState("");
    const [role, setRole] = useState("");
    const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Cek apakah semua field terisi
        if (!name || !email || !password || !alamat || !no_hp || !role) {
            setToast({
                type: "error",
                message: "Harap isi semua field sebelum submit.",
            });
            return;
        }

        try {
            const newUser = { name, email, password, alamat, no_hp, role };
            const response = await axiosInstance.post(
                "http://localhost:2000/user/register",
                newUser,
                { headers: { "Content-Type": "application/json" } }
            );

            // Reset field dan toast
            setName(""); setEmail(""); setPassword(""); setAlamat(""); setNo_hp(""); setRole("");
            setToast({ type: "success", message: "User berhasil ditambahkan." });

            onAddUser(response.data);
            onClose();
        } catch (error) {
            console.error("Gagal menambahkan user", error);
            setToast({ type: "error", message: "Terjadi kesalahan saat menambahkan user." });
        }
    };



    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    >
                        <option value="">Pilih Role</option>
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">Alamat</label>
                    <input
                        type="text"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-gray-700 dark:text-gray-300">No Hp</label>
                    <input
                        type="number"
                        value={no_hp}
                        onChange={(e) => setNo_hp(e.target.value)}
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