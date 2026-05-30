"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  Trash2,
  History,
  Loader2,
  LogOut,
  Edit3,
  Ban,
  CheckCircle2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SettingsSkeleton from "./Skeleton";

export default function SettingsPage() {
  const [admins, setAdmins] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loadingId, setLoadingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const router = useRouter();

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just Now";
    try {
      const date = new Date(dateString);
      const isToday = new Date().toDateString() === date.toDateString();
      if (isToday) {
        return `Today, ${date.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
      }
      return date.toLocaleString("en-GB", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Recently";
    }
  };

  const formatNameFromEmail = (emailStr) => {
    const prefix = emailStr.split("@")[0];
    return prefix
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  async function loadData() {
    try {
      const [adminRes, logRes] = await Promise.all([
        fetch("/api/admin"),
        fetch("/api/audit"),
      ]);

      if (adminRes.status === 401 || logRes.status === 401) {
        return router.push("/admin/login");
      }

      const adminData = await adminRes.json();
      const logData = await logRes.json();

      setAdmins(Array.isArray(adminData) ? adminData : adminData.data || []);
      setLogs(Array.isArray(logData) ? logData : logData.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleLogout() {
    if (!confirm("Are you sure you want to logout?")) return;
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  async function addAdmin(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (res.ok) {
        setEmail("");
        setPassword("");
        setRole("admin");
        showFeedback("Admin account created successfully.");
        loadData();
      } else {
        const err = await res.json();
        showFeedback(err.message || "Failed to create admin", "error");
      }
    } catch (error) {
      showFeedback("An error occurred during creation.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteAdmin(id) {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/${id}`, { method: "DELETE" });
      if (res.ok) {
        showFeedback("Admin removed successfully.");
        loadData();
      } else {
        const err = await res.json();
        showFeedback(err.message || "Delete failed", "error");
      }
    } catch (error) {
      showFeedback("Connection error.", "error");
    } finally {
      setLoadingId(null);
    }
  }

  async function clearLogs() {
    if (!confirm("Permanently delete ALL audit logs? This cannot be undone."))
      return;
    try {
      const res = await fetch("/api/audit", { method: "DELETE" });
      if (res.ok) {
        showFeedback("Logs cleared.");
        loadData();
      }
    } catch (error) {
      showFeedback("Failed to clear logs.", "error");
    }
  }

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="min-h-screen bg-[#FCFAEF] text-[#2C1F16] font-sans pb-20">
      {/* DOM FEEDBACK OVERLAY */}
      {feedback && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-[#EADCC9] shadow-lg p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2
            className={
              feedback.type === "error" ? "text-red-500" : "text-green-600"
            }
          />
          <p className="text-sm font-semibold text-[#3B2519]">
            {feedback.message}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto pt-16 px-6">
        {/* HEADER SECTION */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#3B2519] mb-3 tracking-tight">
              Admin Management
            </h1>
            <p className="text-[#8C4B25] text-sm max-w-xl leading-relaxed">
              Manage the stewards of the Lynvista experience. Grant, revoke, and
              monitor administrative permissions across the concierge ecosystem.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-[#8C4B25] hover:text-[#3B2519] bg-white border border-[#EADCC9] px-6 py-2.5 rounded-md font-semibold text-sm transition-all hover:shadow-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Actions & Logs (Span 4) */}
          <div className="lg:col-span-4 space-y-8">
            {/* ADD ADMIN CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-[#EADCC9] p-7">
              <div className="flex items-center gap-3 mb-6 text-[#3B2519]">
                <UserPlus size={22} className="text-[#D97706]" />
                <h2 className="font-serif text-2xl font-bold">Add New Admin</h2>
              </div>

              <form onSubmit={addAdmin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8C4B25]">
                    Email Address
                  </label>
                  <input
                    className="w-full bg-[#FCFAEF] border border-[#EADCC9] p-3 rounded-md outline-none focus:ring-2 focus:ring-[#FBBF24] transition-all text-sm"
                    placeholder="admin@lynvista.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8C4B25]">
                    Initial Password
                  </label>
                  <input
                    className="w-full bg-[#FCFAEF] border border-[#EADCC9] p-3 rounded-md outline-none focus:ring-2 focus:ring-[#FBBF24] transition-all text-sm tracking-widest"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8C4B25]">
                    Access Level
                  </label>
                  <select
                    className="w-full bg-[#FCFAEF] border border-[#EADCC9] p-3 rounded-md outline-none focus:ring-2 focus:ring-[#FBBF24] transition-all text-sm cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Administrator</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#5C3D2E] text-white p-3.5 rounded-md font-bold text-sm hover:bg-[#3B2519] transition-colors shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Create Admin Account"
                  )}
                </button>
              </form>
            </div>

            {/* AUDIT LOGS CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-[#EADCC9] p-7">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-[#3B2519]">
                  <History size={20} className="text-[#D97706]" />
                  <h2 className="font-serif text-2xl font-bold">Audit Logs</h2>
                </div>
                {logs.length > 0 && (
                  <button
                    onClick={clearLogs}
                    className="text-xs font-bold text-[#8C4B25] hover:text-[#D97706] transition-colors"
                  >
                    View All / Clear
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="text-sm p-4 bg-[#FCFAEF] border-l-2 border-[#D97706] rounded-r-md flex flex-col gap-1.5"
                    >
                      <span className="font-semibold text-[#3B2519] leading-tight">
                        {log.action}
                      </span>
                      <span className="text-[#8C8279] text-xs">
                        {formatDate(log.created_at)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-[#8C8279] border border-dashed border-[#EADCC9] rounded-lg">
                    No recent system activity.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stewards List & Banner (Span 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* ACTIVE STEWARDS TABLE CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-[#EADCC9] overflow-hidden flex flex-col">
              <div className="p-7 border-b border-[#EADCC9] flex justify-between items-end bg-white">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-[#D97706] mb-1">
                    Active Stewards
                  </h2>
                  <p className="text-sm text-[#8C8279]">
                    Managing the core team accounts.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm font-semibold text-[#8C4B25]">
                  <span>All Roles</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF2E8] text-[10px] tracking-widest uppercase text-[#8C4B25] border-y border-[#EADCC9]">
                      <th className="py-4 px-7 font-bold">Administrator</th>
                      <th className="py-4 px-4 font-bold">Role</th>
                      <th className="py-4 px-4 font-bold">Last Login</th>
                      <th className="py-4 px-7 font-bold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length > 0 ? (
                      admins.map((admin, idx) => {
                        const displayName = formatNameFromEmail(admin.email);
                        const isSuperAdmin = admin.role === "super_admin";

                        return (
                          <tr
                            key={admin.id}
                            className="border-b border-gray-50 hover:bg-[#FCFAEF]/50 transition group"
                          >
                            <td className="py-5 px-7">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-gray-100 text-gray-600">
                                  {getInitials(displayName)}
                                </div>
                                <div>
                                  <h4 className="font-bold text-[#2C1F16] text-sm">
                                    {displayName}
                                  </h4>
                                  <p className="text-xs text-[#8C8279]">
                                    {admin.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider inline-block
                                ${isSuperAdmin ? "bg-[#FBBF24] text-[#78350F]" : "text-[#8C8279]"}`}
                              >
                                {isSuperAdmin ? (
                                  <>
                                    Super
                                    <br />
                                    Admin
                                  </>
                                ) : (
                                  "Editor"
                                )}
                              </span>
                            </td>
                            <td className="py-5 px-4 text-sm text-[#5C3D2E] font-medium whitespace-pre-line">
                              {formatDate(admin.created_at)}
                            </td>
                            <td className="py-5 px-7">
                              <div className="flex items-center justify-end gap-3 text-gray-400">
                                <button
                                  className="p-1.5 hover:text-[#D97706] transition"
                                  title="Edit Permissions"
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button
                                  onClick={() => deleteAdmin(admin.id)}
                                  disabled={loadingId === admin.id}
                                  className="p-1.5 hover:text-red-600 transition disabled:opacity-50"
                                  title="Revoke Access"
                                >
                                  {loadingId === admin.id ? (
                                    <Loader2
                                      size={18}
                                      className="animate-spin"
                                    />
                                  ) : isSuperAdmin ? (
                                    <Ban
                                      size={18}
                                      className="text-red-400/50 hover:text-red-600"
                                    />
                                  ) : (
                                    <Trash2
                                      size={18}
                                      className="text-red-400 hover:text-red-600"
                                    />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-16 text-center text-[#8C8279] text-sm"
                        >
                          No administrative accounts registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-[#FAF2E8]/40 border-t border-[#EADCC9] flex items-center justify-between text-xs font-bold text-[#8C4B25]">
                <span>Showing {admins.length} Administrators</span>
                <div className="flex gap-1">
                  <button className="px-2.5 py-1 border border-[#EADCC9] rounded bg-white hover:bg-gray-50 transition text-gray-400">
                    &lt;
                  </button>
                  <button className="px-2.5 py-1 border border-[#5C3D2E] rounded bg-[#5C3D2E] text-white transition">
                    1
                  </button>
                  <button className="px-2.5 py-1 border border-[#EADCC9] rounded bg-white hover:bg-gray-50 transition">
                    2
                  </button>
                  <button className="px-2.5 py-1 border border-[#EADCC9] rounded bg-white hover:bg-gray-50 transition text-gray-400">
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* AESTHETIC BANNER */}
            <div className="relative rounded-xl overflow-hidden h-48 shadow-sm flex items-end p-6 border border-[#EADCC9]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B0B] via-[#5C3D2E] to-[#D97706] opacity-90 z-0"></div>
              <div className="absolute inset-0 bg-black/20 z-0"></div>

              <div className="relative z-10">
                <h3 className="text-white font-serif text-2xl font-bold mb-1 tracking-wide">
                  Preserving the Horizon
                </h3>
                <p className="text-white/80 text-sm max-w-lg">
                  Every administrative action is a step toward ensuring the
                  legacy of the wild remains untouched for the modern explorer.
                </p>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <div className="w-2 h-2 border-2 border-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 mb-8 pt-6 border-t border-[#E8E2D9] flex justify-between text-xs text-[#8C8279] font-medium tracking-wide">
          <span>Lynvista Safaris</span>
          <span>© 2026 Lynvista Safaris. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
