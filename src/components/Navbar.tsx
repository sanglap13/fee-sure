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
    <nav className="bg-gray-900/80 py-4 backdrop-blur-sm border-b border-gray-800 h-16">
      <div className="mx-8 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold leading-[1.2] tracking-tighter text-gradient geist-sans">
          FeeSure
        </h1>
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
