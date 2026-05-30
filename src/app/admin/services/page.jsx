"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import * as LucideIcons from "lucide-react"; // Imported for real-time reflection
import { DynamicIcon } from "@/app/utils/icon-mapper";

// Pre-compute and filter icon names once outside the render loop for performance
const ALL_LUCIDE_NAMES = Object.keys(LucideIcons).filter(
  (key) =>
    typeof LucideIcons[key] === "object" ||
    typeof LucideIcons[key] === "function",
);

export default function ManageOfferings() {
  const [servicesList, setServicesList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // DOM UI tracking states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  // New state to manage the live icon dropdown search visibility
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon_name: "",
    is_active: true,
  });

  // Close dropdown if user clicks completely outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowIconDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute live matching icons based on what the user typed
  const matchingIcons =
    formData.icon_name.trim() === ""
      ? ALL_LUCIDE_NAMES.slice(0, 30) // Show top 30 initial choices if empty
      : ALL_LUCIDE_NAMES.filter((name) =>
          name.toLowerCase().includes(formData.icon_name.toLowerCase()),
        ).slice(0, 30); // Capped at 30 to keep DOM rendering instant

  // Helper to trigger status feedback banners
  const triggerNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Services
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setServicesList(data);
    } catch (error) {
      triggerNotification(
        "error",
        "Failed to load services. Please check your connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Compute stats
  const totalServices = servicesList.length;
  const activeListings = servicesList.filter((s) => s.is_active).length;
  const drafts = totalServices - activeListings;

  // Handle Form Submission (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/services/${editingId}`
      : "/api/admin/services";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      triggerNotification(
        "success",
        `Successfully ${editingId ? "updated" : "created"} "${formData.name}"`,
      );
      setIsModalOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      triggerNotification(
        "error",
        `Failed to save changes for "${formData.name}".`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/services/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();

      triggerNotification("success", "Service template permanently removed.");
      setDeleteConfirmId(null);
      fetchServices();
    } catch (error) {
      triggerNotification(
        "error",
        "Could not delete service profile. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      icon_name: service.icon_name,
      is_active: service.is_active,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", icon_name: "", is_active: true });
    setShowIconDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#FCFAEF] text-[#2C1F16] font-sans pb-20">
      <div className="max-w-6xl mx-auto pt-16 px-6">
        {/* Dynamic Global Status Notifications via DOM */}
        {notification && (
          <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="text-sm font-semibold">
              {notification.message}
            </span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 opacity-60 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-serif font-bold text-[#3B2519] mb-3">
              Manage Offerings
            </h1>
            <p className="text-[#5C4D43] text-lg max-w-xl">
              Curate the pinnacle of East African hospitality. Add, refine, or
              update your signature safari and luxury concierge services here.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-[#FBBF24] hover:bg-[#F59E0B] transition-colors text-[#3B2519] font-semibold py-3 px-6 rounded shadow-sm flex items-center gap-2"
          >
            <Plus size={20} /> Add New Service
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-[#FAF2E8] p-6 rounded-md shadow-sm">
            <h3 className="text-xs font-bold tracking-widest text-[#5C4D43] uppercase mb-4">
              Total Services
            </h3>
            <p className="text-4xl font-serif font-bold text-[#8C4B25]">
              {isLoading ? (
                <span className="inline-block w-8 h-8 bg-[#EADCC9] rounded animate-pulse" />
              ) : (
                totalServices
              )}
            </p>
          </div>
          <div className="bg-[#FAF2E8] p-6 rounded-md shadow-sm">
            <h3 className="text-xs font-bold tracking-widest text-[#5C4D43] uppercase mb-4">
              Active Listings
            </h3>
            <p className="text-4xl font-serif font-bold text-[#9A7B39]">
              {isLoading ? (
                <span className="inline-block w-8 h-8 bg-[#EADCC9] rounded animate-pulse" />
              ) : (
                activeListings
              )}
            </p>
          </div>
          <div className="bg-[#FAF2E8] p-6 rounded-md shadow-sm">
            <h3 className="text-xs font-bold tracking-widest text-[#5C4D43] uppercase mb-4">
              Drafts
            </h3>
            <p className="text-4xl font-serif font-bold text-[#5C4D43]">
              {isLoading ? (
                <span className="inline-block w-8 h-8 bg-[#EADCC9] rounded animate-pulse" />
              ) : (
                drafts
              )}
            </p>
          </div>
        </div>

        {/* Services Table Matrix */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs tracking-widest uppercase text-[#5C4D43]">
                <th className="py-5 px-6 font-bold">Service Detail</th>
                <th className="py-5 px-6 font-bold">Icon Name</th>
                <th className="py-5 px-6 font-bold">Status</th>
                <th className="py-5 px-6 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-gray-100 animate-pulse shrink-0" />
                        <div className="space-y-2 w-full">
                          <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="h-5 bg-gray-100 animate-pulse rounded w-16" />
                    </td>
                    <td className="py-5 px-6">
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-12" />
                    </td>
                    <td className="py-5 px-6">
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-10" />
                    </td>
                  </tr>
                ))
              ) : servicesList.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-14 text-center text-gray-400 font-medium text-sm"
                  >
                    No active services profiles found. Click "Add New Service"
                    to build one.
                  </td>
                </tr>
              ) : (
                servicesList.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-[#FAF2E8] text-[#8C4B25] flex items-center justify-center shrink-0">
                          <DynamicIcon
                            name={service.icon_name}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#2C1F16] text-base">
                            {service.name}
                          </h4>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-mono">
                        {service.icon_name}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      {service.is_active ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>{" "}
                          Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>{" "}
                          Draft
                        </div>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3 text-gray-400">
                        <button
                          onClick={() => openEditModal(service)}
                          className="hover:text-blue-600 transition"
                          title="Edit Service Profile"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(service.id)}
                          className="hover:text-red-600 transition"
                          title="Remove Service Profile"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Design Frame */}
        <div className="mt-12 pt-6 border-t border-[#E8E2D9] flex justify-between text-sm text-[#8C8279] font-medium max-w-4xl mx-auto">
          <span>Lynvista Safaris</span>
          <span>© 2026 Lynvista Safaris. All rights reserved.</span>
          <span>Privacy Policy</span>
        </div>
      </div>

      {/* Write/Edit Operations Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-serif font-bold text-[#3B2519] mb-6">
              {editingId ? "Edit Service" : "Add New Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  required
                  disabled={isSubmitting}
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#FBBF24] outline-none disabled:bg-gray-50 text-sm"
                  placeholder="e.g., Authentic Safari Experiences"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  disabled={isSubmitting}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-[#FBBF24] outline-none disabled:bg-gray-50 text-sm"
                  rows={3}
                  placeholder="Multi-day guided tours..."
                />
              </div>

              {/* Dynamic Auto-suggest Icon Selector Container */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Lucide Icon Name
                </label>
                <div className="relative flex items-center">
                  <input
                    required
                    disabled={isSubmitting}
                    type="text"
                    value={formData.icon_name}
                    onFocus={() => setShowIconDropdown(true)}
                    onChange={(e) => {
                      setFormData({ ...formData, icon_name: e.target.value });
                      setShowIconDropdown(true);
                    }}
                    className="w-full border border-gray-300 rounded p-2 pr-9 focus:ring-2 focus:ring-[#FBBF24] outline-none disabled:bg-gray-50 font-mono text-sm"
                    placeholder="Type to search (e.g., Compass, Tree)"
                  />
                  <div className="absolute right-3 text-gray-400">
                    {formData.icon_name ? (
                      <DynamicIcon
                        name={formData.icon_name}
                        className="w-4 h-4 text-[#8C4B25]"
                      />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Live Real-time Icon Results Panel */}
                {showIconDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto z-50 p-2">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 px-2 pb-2 border-b border-gray-100 mb-2">
                      Matching Lucide Tokens ({matchingIcons.length})
                    </p>
                    {matchingIcons.length === 0 ? (
                      <p className="text-xs text-gray-400 p-2 text-center">
                        No matching system icons found.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-1">
                        {matchingIcons.map((iconName) => {
                          const IconPreview = LucideIcons[iconName];
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  icon_name: iconName,
                                });
                                setShowIconDropdown(false);
                              }}
                              className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-[#FAF2E8] text-xs text-gray-700 transition font-mono group"
                            >
                              <div className="w-6 h-6 rounded bg-gray-50 text-gray-500 flex items-center justify-center group-hover:bg-white group-hover:text-[#8C4B25] shrink-0">
                                <IconPreview className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate">{iconName}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  disabled={isSubmitting}
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-[#FBBF24] focus:ring-[#FBBF24] border-gray-300 rounded disabled:opacity-50"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-bold text-gray-700 select-none cursor-pointer"
                >
                  Set as Active Listing
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#3B2519] text-white font-bold py-3 rounded mt-4 hover:bg-[#2C1F16] transition flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting
                  ? "Processing Request..."
                  : editingId
                    ? "Save Changes"
                    : "Create Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Structured DOM Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#3B2519] mb-2">
              Delete Service?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be reversed. Are you certain you want to remove
              this data block?
            </p>
            <div className="flex gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
