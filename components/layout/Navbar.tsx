"use client";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useAuth } from "@/hook/UseAuth";
import { usePathname } from "next/navigation";

export default function CyberNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Access Denied:", error);
    }
  };

  return (
    <>
      {/* Glowing Top Bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-pulse" />

      {/* Main Navbar */}
      <nav className="bg-gray-900 border-b border-cyan-500/30 backdrop-blur-lg px-4">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Nav */}
          <div className="flex items-center justify-between h-16">
            {/* Logo with Hacker Terminal Effect */}
            <Link href="/dashboard" className="flex items-center group">
              <div className="relative mr-3">
                <div className="absolute -inset-1 bg-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200" />
                <div className="relative w-3 h-3 bg-cyan-400 rounded-full animate-[pulse_1.5s_infinite]" />
              </div>
              <span className="text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-tighter">
                <span className="text-blue-400">CyberShield</span>
                <span className="text-cyan-400">Analytics</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/dashboard">
                <div
                  className={`px-4 py-2 font-mono text-sm relative group overflow-hidden ${
                    isActive("/dashboard")
                      ? "text-cyan-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    {isActive("/dashboard") && (
                      <span className="mr-2 text-cyan-400">$</span>
                    )}
                    dashboard
                  </span>
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                      isActive("/dashboard")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </div>
              </Link>

              <Link href="/dashboard/clustering">
                <div
                  className={`px-4 py-2 font-mono text-sm relative group overflow-hidden ${
                    isActive("/dashboard/clustering")
                      ? "text-cyan-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    {isActive("/dashboard/clustering") && (
                      <span className="mr-2 text-cyan-400">$</span>
                    )}
                    clustering
                  </span>
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                      isActive("/dashboard/clustering")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </div>
              </Link>
            </div>

            {/* User Controls */}
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-[pulse_2s_infinite]" />
                  <span className="text-xs font-mono text-cyan-300/90 tracking-tight">
                    {user?.email?.replace(/@.*/, "@SECURE")}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-mono px-3 py-1 rounded-md bg-gradient-to-r from-gray-800 to-gray-900 border border-cyan-500/30 hover:border-cyan-400/50 hover:text-white transition-all duration-200 flex items-center shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                >
                  <span className="text-cyan-400 mr-1">⏻</span> logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <div className="w-6 flex flex-col items-end space-y-1.5">
                <div
                  className={`h-0.5 bg-cyan-400 transition-all ${
                    menuOpen ? "w-4 rotate-45 translate-y-2" : "w-6"
                  }`}
                />
                <div
                  className={`h-0.5 bg-cyan-400 transition-all ${
                    menuOpen ? "opacity-0" : "w-5"
                  }`}
                />
                <div
                  className={`h-0.5 bg-cyan-400 transition-all ${
                    menuOpen ? "w-4 -rotate-45 -translate-y-2" : "w-4"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              menuOpen ? "max-h-96 py-2" : "max-h-0"
            }`}
          >
            <div className="flex flex-col space-y-2 px-2">
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <div
                  className={`px-4 py-3 rounded-md font-mono flex items-center ${
                    isActive("/dashboard")
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <span className="mr-2">
                    {isActive("/dashboard") ? ">" : "•"}
                  </span>{" "}
                  Dashboard
                </div>
              </Link>
              <Link
                href="/dashboard/clustering"
                onClick={() => setMenuOpen(false)}
              >
                <div
                  className={`px-4 py-3 rounded-md font-mono flex items-center ${
                    isActive("/dashboard/clustering")
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <span className="mr-2">
                    {isActive("/dashboard/clustering") ? ">" : "•"}
                  </span>{" "}
                  Attack Clustering
                </div>
              </Link>
              {user && (
                <div className="pt-2 mt-2 border-t border-cyan-500/10">
                  <div className="px-4 py-2 text-xs font-mono text-cyan-300/80 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-[pulse_2s_infinite] mr-2" />
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-md font-mono text-left text-cyan-400 hover:bg-gray-800 flex items-center"
                  >
                    <span className="mr-2">⏻</span> Terminate Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
