"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { auth } from '../apis/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './styles/login.module.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    setIsError(false); // Reset error animation state

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect or show a success message here
      alert('Login successful!');
    } catch (err) {
      setError('Email or Password is Incorrect'); // Set error message
      setIsError(true); // Trigger error animation
    }
  };

  return (
    <div className={styles["login-page"]}>
      <Head>
        <title>Hermes III Login</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles["login-container"]}>
        {/* Icon */}
        <div className={styles["login-icon"]}>
          <div>
            <img src="/login-icon.png" alt="Login Icon"/>
          </div>
        </div>

        {/* Title */}
        <h2 className={styles["login-title"]}>Login</h2>

        {/* Login Form */}
        <form className={styles["login-form"]} onSubmit={handleLogin}>

          <div className={styles["form-group"]}>
            <label htmlFor="email" className={styles["form-label"]}>
              Email address
            </label>

            <input type="email" id="email" className={styles["form-input"]}

            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

            required />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="password" className={styles["form-label"]}>
              Password
            </label>

            <input type="password" id="password" className={styles["form-input"]}

            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

            required />
          </div>

          <button type="submit" className={`${styles["login-button"]} ${isError ? styles['login-error'] : ''}`}>
          {isError ? 'Email or Password is Incorrect' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
