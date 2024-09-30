import Image from "next/image";
import Head from 'next/head';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [buttonText, setButtonText] = useState('Sign In');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Reset any previous error states
      setErrorMessage('');
      setIsShaking(false);
      setButtonText('Signing In...');

      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSuccessMessage(`Welcome ${user.email}`);
      setButtonText('Sign In'); // Reset button text upon success
    } catch (error) {
      // Show error message and shake button
      setErrorMessage('Email or password is incorrect');
      setButtonText('Email or password is incorrect');
      setIsShaking(true);

      // Stop shaking after the animation completes
      setTimeout(() => {
        setIsShaking(false);
        setButtonText('Sign In'); 
      }, 500); // Shake duration is 500ms
    }
  };


  return (
    <div className="login-page">
      <Head>
        <title>Hermes III Login</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="login-container">
        {/* Icon */}
        <div className="login-icon">
          <img src="/login-icon.svg" alt="Login Icon" />
        </div>

        {/* Title */}
        <h2 className="login-title">Login</h2>

        {/* Login Form */}
        <form className="login-form">

          {errorMessage && <p className="error-message text-red-500">{errorMessage}</p>}
          {successMessage && <p className="success-message text-green-500">{successMessage}</p>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>

            <input type="email" id="email" className="form-input"
            
            value={email}
            onChange={(e) => setEmail(e.target.value)}

            required />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>

            <input type="password" id="password" className="form-input"
            
            value={password}
            onChange={(e) => setPassword(e.target.value)}

            required />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
