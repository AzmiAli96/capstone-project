"use client"

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";
import { FormEvent } from "react";
import { CircleUserRound } from "lucide-react";
import Toast from "@/components/Toast";

export default function ProfileAdministrator() {
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alamat, setAlamat] = useState("");
    const [no_hp, setNo_hp] = useState("");
    const [role, setRole] = useState("");
    const [image, setImage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

    // Ambil data user dari API Next.js
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/api/getUser");
                const user = res.data.user;

                console.log("User data dari /api/getUser:", user);

                setUserId(user.id);
                setName(user.name || "");
                setEmail(user.email || "");
                setAlamat(user.alamat || "");
                setNo_hp(user.no_hp || "");
                setRole(user.role || "");
                setImage(user.image || "");
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
                setToast({ type: "error", message: "Gagal mengambil data pengguna" });
            }
        };

        fetchUser();
    }, []);

    const uploadImage = async (): Promise<string | null> => {
        if (!selectedFile) return null;

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("id", userId?.toString() || "");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/upload`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Uploaded image path:", result.data);
                return result.data; // path gambar
            } else {
                setToast({ type: "error", message: `Upload gagal: ${result.error}` });
                return null;
            }
        } catch (error) {
            console.error("Upload error:", error);
            setToast({ type: "error", message: "Terjadi kesalahan saat upload gambar." });
            return null;
        }
    };
    console.log("Image path:", image);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            let uploadedImagePath = image;

            if (selectedFile) {
                const uploaded = await uploadImage();
                if (uploaded) {
                    uploadedImagePath = uploaded;
                    setImage(uploaded);
                }
            }
            const updatedUser = {
                name,
                email,
                password,
                alamat,
                no_hp,
                role,
                image: uploadedImagePath,
            };

            if (!userId) return;

            const response = await axiosInstance.put(`/user/${userId}`, updatedUser, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            console.log("User berhasil diperbarui:", response.data);
            setToast({ type: "success", message: "Profil berhasil diperbarui!" });
        } catch (error) {
            console.error("Gagal memperbarui user:", error);
            alert("Gagal memperbarui profil.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setToast({ type: "error", message: "Gagal memperbarui profil." });
        }
    };



    return (
        <div className="min-h-screen bg-[#e3eaf2] flex items-center justify-center px-4 py-10">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-4xl flex flex-col md:flex-row justify-between gap-6"
            >
                {/* Kiri - Gambar Profil */}
                <div className="flex flex-col items-center gap-15 w-full md:w-1/2 border-r md:pr-6 mt-20">
                    <div className="w-48 h-48 rounded-full bg-[#dee3ea] flex items-center justify-center">
                        {image ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                                alt="User Image"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <CircleUserRound className="w-40 h-40 text-gray-500" />
                        )}
                    </div>
                </div>

                {/* Kanan - Form Profil */}
                <div className="w-full md:w-1/2 space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-10">Profile</h2>

                    <div className="flex items-center justify-between mb-6">
                        <label className="w-24 text-gray-800">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="border-b border-gray-400 focus:outline-none focus:border-gray-600 w-2/3 text-left"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="w-24 text-gray-800">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="border-b border-gray-400 focus:outline-none focus:border-gray-600 w-2/3 text-left"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="w-24 text-gray-800">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="border-b border-gray-400 focus:outline-none focus:border-gray-600 w-2/3 text-left"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="w-24 text-gray-800">Alamat</label>
                        <input
                            type="text"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            placeholder="Alamat"
                            className="border-b border-gray-400 focus:outline-none focus:border-gray-600 w-2/3 text-left"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="w-24 text-gray-800">No HP</label>
                        <input
                            type="text"
                            value={no_hp}
                            onChange={(e) => setNo_hp(e.target.value)}
                            placeholder="No HP"
                            className="border-b border-gray-400 focus:outline-none focus:border-gray-600 w-2/3 text-left"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <label className="w-24 text-gray-800">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border rounded px-2 py-1 text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button type="submit" className="border rounded-full px-6 py-2 bg-[#00ff26] hover:bg-green text-gray-700 font-semibold">
                            Update
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
