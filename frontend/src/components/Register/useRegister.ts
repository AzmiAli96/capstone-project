"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nohp, setNohp] = useState("");
  const [role] = useState("customer");  // role default "customer"
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !alamat || !nohp) {
      setError("Semua field harus diisi!");
      return;
    }

    try {
      const response = await fetch("http://localhost:2000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password, alamat, no_hp: nohp, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registrasi gagal");
        return;
      }

      router.push("/auth/login");
    } catch {
      setError("Gagal terhubung ke server");
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    alamat,
    setAlamat,
    nohp,
    setNohp,
    role,
    error,
    handleSubmit,
  };
};
