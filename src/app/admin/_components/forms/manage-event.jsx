"use client";

import { useState } from "react";

export default function ContentEditor() {
  const [content, setContent] = useState("");

  const saveContent = async () => {
    await fetch("/api/admin/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    alert("Content saved");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2
        className="text-xl font-heading mb-6"
        style={{ color: "var(--color-dark)" }}
      >
        Website Content
      </h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded p-4 h-40"
        placeholder="Edit homepage content..."
      />

      <button
        onClick={saveContent}
        className="mt-4 px-6 py-3 rounded"
        style={{
          background: "var(--color-primary)",
          color: "white",
        }}
      >
        Save Changes
      </button>
    </div>
  );
}
