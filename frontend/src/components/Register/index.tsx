"use client"
import React, { useState } from 'react';
import styles from "../css/Login.module.css"

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");
  const [nohp, setNohp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, alamat, nohp, email, password });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className="mb-8">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Alamat"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="text"
            placeholder="No HP"
            value={nohp}
            onChange={(e) => setNohp(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <a href="/auth/login" className={styles.link}>
              Login
            </a>
            <button type="submit" className={styles.button}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;

