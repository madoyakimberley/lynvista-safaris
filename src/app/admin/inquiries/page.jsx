"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Eye,
  CornerUpLeft,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  Send,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function ManageInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Action States
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Processing States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Helper to trigger status feedback banners
  const triggerNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Data
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inquiry");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      triggerNotification(
        "error",
        "Failed to load inquiries. Check connection.",
      );
      // Fallback mock data for visual testing using matching schema values
      setInquiries([
        {
          id: 1,
          full_name: "Serena Williams",
          email: "serena.w@gmail.com",
          subject: "Honeymoon Package Inquiry",
          message: "We are looking for a 7-day luxury stay...",
          status: "Pending",
          created_at: "2023-10-24T14:30:00Z",
        },
        {
          id: 2,
          full_name: "David Attenborough",
          email: "david.a@nature.org",
          subject: "Photography Safari Question",
          message: "Do your guides have experience positioning for dawn light?",
          status: "Reviewed",
          created_at: "2023-10-24T11:15:00Z",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Filter & Pagination Logic
  const filteredData = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch =
        inq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        inq.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Handlers
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 💡 FIX: Changed payload status from "COMPLETED" to "Reviewed" to match MySQL ENUM
      const res = await fetch(
        `/api/admin/inquiry/${selectedInquiry.id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: replyMessage, status: "Reviewed" }),
        },
      );

      if (!res.ok) throw new Error();

      triggerNotification(
        "success",
        `Reply sent to ${selectedInquiry.full_name}`,
      );
      setIsReplyModalOpen(false);
      setReplyMessage("");
      fetchInquiries();
    } catch (error) {
      triggerNotification("error", "Failed to send reply. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiry/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      fetchInquiries();
      triggerNotification("success", `Status updated to ${newStatus}`);
    } catch (error) {
      triggerNotification("error", "Failed to update status.");
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiry/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      triggerNotification("success", "Inquiry permanently deleted.");
      setDeleteConfirmId(null);
      fetchInquiries();
    } catch (error) {
      triggerNotification("error", "Failed to delete inquiry.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-[#FDE68A] text-[#92400E]",
      "bg-[#BBF7D0] text-[#166534]",
      "bg-[#FECDD3] text-[#9F1239]",
      "bg-[#BFDBFE] text-[#1E3A8A]",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#FCFAEF] text-[#2C1F16] font-sans pb-20">
      <div className="max-w-6xl mx-auto pt-16 px-6">
        {/* Notifications */}
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

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4 text-[#8C4B25]">
              <div className="p-2 bg-[#FAF2E8] rounded-md">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                Total Inquiries
              </h3>
            </div>
            <p className="text-4xl font-serif font-bold text-[#3B2519]">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-gray-100 rounded animate-pulse" />
              ) : (
                inquiries.length
              )}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4 text-[#B45309]">
              <div className="p-2 bg-yellow-50 rounded-md">
                <ClipboardList size={20} />
              </div>
              <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                Pending Review
              </h3>
            </div>
            <p className="text-4xl font-serif font-bold text-[#3B2519]">
              {isLoading ? (
                <span className="inline-block w-12 h-8 bg-gray-100 rounded animate-pulse" />
              ) : (
                // 💡 FIX: Counts records that are explicitly "Pending"
                inquiries.filter((i) => i.status.toLowerCase() === "pending")
                  .length
              )}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4 text-[#16A34A]">
              <div className="p-2 bg-green-50 rounded-md">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                Reviewed Items
              </h3>
            </div>
            <p className="text-4xl font-serif font-bold text-[#3B2519]">
              {isLoading ? (
                <span className="inline-block w-12 h-8 bg-gray-100 rounded animate-pulse" />
              ) : (
                // 💡 FIX: Swapped out placeholder for real metrics tracking "Reviewed" items
                inquiries.filter((i) => i.status.toLowerCase() === "reviewed")
                  .length
              )}
            </p>
          </div>
        </div>

        {/* Main Interface Block */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Controls Header */}
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-serif font-bold text-[#3B2519]">
              Guest Inquiries
            </h2>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search guests by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#FBBF24] outline-none"
                />
              </div>

              {/* 💡 FIX: Updated drop-down option values to mirror database Enums */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-4 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#FBBF24] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF2E8] text-xs tracking-widest uppercase text-[#8C4B25] border-y border-[#EADCC9]">
                  <th className="py-4 px-6 font-bold">Guest Name</th>
                  <th className="py-4 px-6 font-bold">Subject / Message</th>
                  <th className="py-4 px-6 font-bold">Received</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
                          <div className="space-y-2 w-full">
                            <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
                            <div className="h-3 bg-gray-100 animate-pulse rounded w-32" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 animate-pulse rounded w-40" />
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-48" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-16" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-6 bg-gray-100 animate-pulse rounded-full w-20" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                          <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-16 text-center text-gray-400 font-medium text-sm"
                    >
                      No inquiries found matching your filters.
                    </td>
                  </tr>
                ) : (
                  currentData.map((inq) => {
                    const { date, time } = formatDate(inq.created_at);
                    return (
                      <tr
                        key={inq.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${getAvatarColor(inq.full_name)}`}
                            >
                              {getInitials(inq.full_name)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[#2C1F16] text-sm">
                                {inq.full_name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {inq.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 max-w-xs">
                          <h4
                            className="font-bold text-[#3B2519] text-sm truncate"
                            title={inq.subject}
                          >
                            {inq.subject}
                          </h4>
                          <p
                            className="text-xs text-gray-500 truncate"
                            title={inq.message}
                          >
                            {inq.message}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-semibold text-gray-700">
                            {date}
                          </div>
                          <div className="text-xs text-gray-500">{time}</div>
                        </td>
                        <td className="py-4 px-6">
                          {/* 💡 FIX: Updated style logic checks to handle schema-conformant terms */}
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5
                            ${
                              inq.status.toLowerCase() === "pending"
                                ? "bg-[#FEF3C7] text-[#92400E]"
                                : inq.status.toLowerCase() === "reviewed"
                                  ? "bg-[#DCFCE7] text-[#166534]"
                                  : "bg-[#FFE4E6] text-[#9F1239]"
                            }`}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setIsReplyModalOpen(true);
                              }}
                              className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="View & Reply"
                            >
                              <Eye size={18} />
                            </button>
                            {/* 💡 FIX: Only show checking option if the inquiry hasn't been reviewed yet */}
                            {inq.status.toLowerCase() === "pending" && (
                              <button
                                onClick={() => updateStatus(inq.id, "Reviewed")}
                                className="p-1.5 hover:text-green-600 hover:bg-green-50 rounded transition"
                                title="Mark Reviewed"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirmId(inq.id)}
                              className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && filteredData.length > 0 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white text-sm">
              <span className="text-gray-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{" "}
                {filteredData.length} results
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded transition ${currentPage === i + 1 ? "bg-[#3B2519] text-white border-[#3B2519]" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Design Frame */}
        <div className="mt-12 pt-6 border-t border-[#E8E2D9] flex justify-between text-sm text-[#8C8279] font-medium max-w-4xl mx-auto">
          <span>Lynvista Safaris</span>
          <span>© 2026 Lynvista Safaris. All rights reserved.</span>
          <span>Privacy Policy</span>
        </div>
      </div>

      {/* View & Reply Modal */}
      {isReplyModalOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#FAF2E8] p-6 border-b border-[#EADCC9] flex justify-between items-start">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#3B2519] mb-1">
                  Reply to Inquiry
                </h2>
                <p className="text-sm text-[#8C4B25]">
                  Replying to:{" "}
                  <span className="font-semibold">
                    {selectedInquiry.full_name}
                  </span>{" "}
                  ({selectedInquiry.email})
                </p>
              </div>
              <button
                onClick={() => !isSubmitting && setIsReplyModalOpen(false)}
                className="text-[#8C4B25] hover:text-[#3B2519] bg-white/50 hover:bg-white rounded-full p-2 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#FCFAEF]/30">
              {/* Original Message Card */}
              <div className="bg-white border border-gray-100 p-5 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
                  <h3 className="font-bold text-[#2C1F16]">
                    {selectedInquiry.subject}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                    {formatDate(selectedInquiry.created_at).date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="space-y-3 mt-4">
                <label className="block text-sm font-bold text-[#3B2519] flex items-center gap-2">
                  <CornerUpLeft size={16} /> Your Response
                </label>
                <textarea
                  required
                  disabled={isSubmitting}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[#FBBF24] outline-none disabled:bg-gray-50 text-sm min-h-[160px] resize-y shadow-inner"
                  placeholder={`Draft your reply to ${selectedInquiry.full_name}...\n(This will mark the status as Reviewed)`}
                />

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !replyMessage.trim()}
                    className="bg-[#3B2519] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#2C1F16] transition flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {isSubmitting ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#3B2519] mb-2">
              Delete Inquiry?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be reversed. Are you certain you want to remove
              this record from the database?
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
