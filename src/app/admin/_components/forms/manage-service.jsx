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

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you want to use cookie authentication, include this
          // credentials: "include",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save service");
        setLoading(false);
        return;
      }

      // Reset form
      setForm({
        name: "",
        description: "",
        icon_name: "",
      });

      // Reload services
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the service");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
        // credentials: "include", // if using cookie auth
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete service");
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the service");
    }
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
              onClick={() => handleDelete(service.id)}
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
