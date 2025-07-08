import React from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            404 - Page Not Found
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <p className="text-base font-medium text-blue-600 hover:text-blue-500">
                Go back to dashboard<span aria-hidden="true"> &rarr;</span>
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
