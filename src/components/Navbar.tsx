"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { removeAuthToken } from "@/lib/auth";

interface NavbarProps {
  userEmail: string;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Remove the auth token from cookies
      removeAuthToken();

      // Sign out from Firebase
      await signOut(auth);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-gray-900/80 p-4 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold geist-sans">FeeSure</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300 geist-mono">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="btn-primary px-4 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
