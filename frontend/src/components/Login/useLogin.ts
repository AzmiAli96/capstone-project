"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";
import jsCookie from "js-cookie";

export const useLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:2000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⬅️ WAJIB supaya cookie dikirim ke browser
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json(); // ← TAMBAHKAN INI!

        const role = result.user.role;

        console.log("Login berhasil dengan role:", role);

        if (role === "customer") {
          router.push("/dashboard");
        } else if (role === "staff") {
          router.push("/staff/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          setError("Role tidak dikenali");
        }
      }
    } catch (error) {
      setError("Gagal terhubung ke server");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  };
};
