"use client";
import React from "react";

export default function NotFoundPage() {

  return (
    <main className="grid h-screen w-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-yellow-500">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry&lsquo; we couldn&apos;t find the page you&apos;  looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-md bg-slate-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </a>
          <a href="/dashboard/contact" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}
