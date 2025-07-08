"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function page() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside className="w-64 bg-gray-800/80 border-r border-cyan-500/20 backdrop-blur-sm">
      <nav className="p-4">
        <ul className="space-y-1">
          <li>
            <Link href="/dashboard">
              <div
                className={`flex items-center p-3 rounded-md transition-all duration-200 font-mono ${
                  isActive("/dashboard")
                    ? "bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400"
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                <span className="ml-3 flex items-center">
                  {isActive("/dashboard") && (
                    <span className="mr-2 text-cyan-400">⎔</span>
                  )}
                  Dashboard
                </span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/clustering">
              <div
                className={`flex items-center p-3 rounded-md transition-all duration-200 font-mono ${
                  isActive("/dashboard/clustering")
                    ? "bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400"
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                <span className="ml-3 flex items-center">
                  {isActive("/dashboard/clustering") && (
                    <span className="mr-2 text-cyan-400">⎔</span>
                  )}
                  Attack Clustering
                </span>
              </div>
            </Link>
          </li>
        </ul>

        {/* Cyber security decorative elements */}
        <div className="mt-8 pt-4 border-t border-cyan-500/10">
          <div className="text-xs font-mono text-gray-500/70 mb-2">
            SYSTEM STATUS
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-mono text-gray-400">
              SECURE CONNECTION
            </span>
          </div>
        </div>
      </nav>
    </aside>
  );
}
