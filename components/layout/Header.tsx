"use client";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useAuth } from "@/hook/UseAuth";

export default function page() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-cyan-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/dashboard">
          <div className="flex items-center space-x-2 group">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
            <p className="text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:from-cyan-300 group-hover:to-blue-400 transition-colors">
              WebAttack<span className="text-cyan-400">Cluster</span>
            </p>
          </div>
        </Link>
        {user && (
          <div className="flex items-center space-x-6">
            <span className="text-sm font-mono text-cyan-100/80 bg-gray-800 px-3 py-1 rounded-full border border-cyan-500/20">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-mono text-cyan-400 hover:text-white px-3 py-1 rounded hover:bg-cyan-500/10 border border-cyan-500/20 transition-all duration-200 flex items-center"
            >
              <span className="mr-2">⎋</span> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
