"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, Shield, Clock, Loader2, LogOut } from "lucide-react";
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
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    try {
      return new Date(dateString).toLocaleString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        day: "numeric",
        month: "short",
      });
    } catch (e) {
      return "Recently";
    }
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
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (res.ok) {
        setEmail("");
        setPassword("");
        loadData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create admin");
      }
    } catch (error) {
      alert("An error occurred during creation.");
    }
  }

  async function deleteAdmin(id) {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        const err = await res.json();
        alert(err.message || "Delete failed");
      }
    } catch (error) {
      alert("Connection error.");
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
        loadData();
      }
    } catch (error) {
      alert("Failed to clear logs.");
    }
  }

  if (loading) return <SettingsSkeleton />;

  return (
    <div
      className="max-w-5xl mx-auto space-y-10 p-4"
      style={{ color: "#2d1a12" }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[#e7e3da]">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield size={28} className="text-[#78350f]" /> Admin Management
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-full font-bold hover:bg-red-100 transition-all cursor-pointer border border-red-100"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* ADD ADMIN FORM */}
      <div className="p-6 rounded-xl shadow-sm border bg-white border-[#e7e3da]">
        <h2 className="font-bold mb-4 flex items-center gap-2 text-lg">
          <UserPlus size={20} className="text-[#78350f]" /> Add New Admin
        </h2>
        <form onSubmit={addAdmin} className="grid md:grid-cols-4 gap-4">
          <input
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#78350f]/20 transition-all"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#78350f]/20 transition-all"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="border p-3 rounded-lg cursor-pointer bg-white outline-none focus:ring-2 focus:ring-[#78350f]/20"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button className="bg-[#78350f] text-white p-3 rounded-lg font-bold hover:bg-[#451a03] transition-colors cursor-pointer">
            Create Account
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ADMINS LIST */}
        <div className="p-6 rounded-xl shadow-sm border bg-white border-[#e7e3da]">
          <h2 className="font-bold mb-4 text-lg">Registered Admins</h2>
          <div className="divide-y max-h-125 overflow-y-auto pr-2">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex justify-between items-center py-4 hover:bg-gray-50 rounded-lg transition-colors px-2"
                >
                  <div>
                    <p className="font-semibold">{admin.email}</p>
                    <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded tracking-tighter">
                      {admin.role}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    disabled={loadingId === admin.id}
                    className="text-red-400 hover:text-red-600 cursor-pointer p-2 transition-colors disabled:opacity-50"
                  >
                    {loadingId === admin.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 py-4 italic">
                No admin records found.
              </p>
            )}
          </div>
        </div>

        {/* AUDIT LOGS */}
        <div className="p-6 rounded-xl shadow-sm border bg-white border-[#e7e3da]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <Clock size={20} className="text-[#78350f]" /> Audit Logs
            </h2>
            {logs.length > 0 && (
              <button
                onClick={clearLogs}
                className="text-[10px] text-red-600 font-black uppercase cursor-pointer hover:underline tracking-widest"
              >
                Clear History
              </button>
            )}
          </div>
          <div className="max-h-125 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="text-sm p-4 bg-gray-50 border border-gray-100 rounded-xl flex flex-col gap-1"
                >
                  <span className="font-bold text-[#451a03] leading-tight">
                    {log.action}
                  </span>
                  <span className="text-gray-400 text-[10px] font-mono italic">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic py-4">
                No recent activity recorded.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
