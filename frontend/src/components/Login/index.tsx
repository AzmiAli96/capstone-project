"use client"
import React, { useState } from 'react';
import styles from '../css/Login.module.css';
import { useRouter } from 'next/navigation';
import { useLogin } from './useLogin';

const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  } = useLogin();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className="mb-8">Login</h2>
        <form onSubmit={handleSubmit}>
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
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className={styles.actions}>
            <a href="/auth/register" className={styles.link}>
              Register
            </a>
            <button type="submit" className={styles.button}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
