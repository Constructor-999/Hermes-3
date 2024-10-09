"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../modules/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import styles from "../styles/login.module.css";
import { useAuth } from "../context/AuthContext";
import { hermesLogin } from "../modules/hermesMisc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsError(false);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoading(false);
      setIsError(true);
    }
  };

  const asyncLogin = async () => {
    const loginStatus = await hermesLogin(user, email, password);
    if (loginStatus) {
      router.push("/timetable");
    } else {
      setLoading(false);
      await signOut(auth);
    }
  };

  if (user) asyncLogin();

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
            <img src="/login-icon.png" alt="Login Icon" />
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

            <input
              type="email"
              id="email"
              className={styles["form-input"]}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="password" className={styles["form-label"]}>
              Password
            </label>

            <input
              type="password"
              id="password"
              className={styles["form-input"]}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`${styles["login-button"]} ${
              isError ? styles["login-error"] : ""
            }`}
            //disabled={loading}
          >
            {loading
              ? "Logging in..."
              : `${isError ? "Email or Password is Incorrect" : "Sign In"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
