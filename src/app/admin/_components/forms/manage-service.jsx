"use client";

import { useState } from "react";

export default function ManageService({ services = [] }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon_name: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    await fetch("/api/admin/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      description: "",
      icon_name: "",
    });

    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-heading text-(--color-dark)">
        Manage Services
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.name}
          placeholder="Service Name"
          className="w-full border p-3 rounded text-(--color-dark)"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          value={form.icon_name}
          placeholder="Icon Name (e.g. FaHotel)"
          className="w-full border p-3 rounded text-(--color-dark)"
          onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
        />

        <textarea
          value={form.description}
          placeholder="Description"
          className="w-full border p-3 rounded text-(--color-dark)"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          disabled={loading}
          className="px-6 py-3 rounded text-white bg-(--color-primary)"
        >
          {loading ? "Saving..." : "Save Service"}
        </button>
      </form>

      {/* LIST SERVICES */}
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <div>
              <p className="font-semibold text-(--color-dark)">
                {service.name}
              </p>
              <p className="text-sm text-gray-500">{service.icon_name}</p>
            </div>

            <button
              onClick={async () => {
                await fetch(`/api/admin/services/${service.id}`, {
                  method: "DELETE",
                });
                window.location.reload();
              }}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
