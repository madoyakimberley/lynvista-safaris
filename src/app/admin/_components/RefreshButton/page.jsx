"use client";

export default function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="bg-[#451a03] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90"
    >
      Try Again
    </button>
  );
}
