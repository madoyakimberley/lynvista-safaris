"use client";

import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-(--color-light) p-6">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center border border-gray-100 max-w-lg">
        <h1 className="text-4xl font-heading text-(--color-dark) mb-4">
          Booking Confirmed ✈️
        </h1>

        <p className="mb-8 text-(--color-dark-muted) text-lg">
          Your booking has been received successfully. A confirmation email has
          been sent to you.
        </p>

        <Link
          href="/"
          className="inline-block bg-(--color-dark) text-(--color-secondary) px-8 py-3 rounded-xl font-bold hover:bg-(--color-dark-muted) transition"
        >
          Back Home
        </Link>
      </div>
    </main>
  );
}
