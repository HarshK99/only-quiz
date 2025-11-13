"use client";

import { useEffect } from "react";

export default function QuizRedirectPage() {
  useEffect(() => {
    // This page is intended to be reached via client-side navigation from `/`.
    // If the user reloads or opens `/quiz` directly, send them back to home.
    // We provide a visual fallback in case JS is disabled, but this component
    // will redirect immediately in normal usage.
    try {
      window.location.replace("/");
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Quiz page</h1>
        <p className="text-sm text-gray-600 mb-6">
          This page is intended to be opened from the home screen. Redirecting you
          back to the start...
        </p>
        <a
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
          href="/"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
