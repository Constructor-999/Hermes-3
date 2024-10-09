import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";

function HermesIII({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default HermesIII;
