import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth"; // Import Firebase signOut function
import { auth } from "../modules/firebase";

export default function Timetable() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Check if the user is not authenticated, and redirect to the login page
  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // Redirect to login page if not logged in
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
      router.push("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome to your dashboard!</p>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
