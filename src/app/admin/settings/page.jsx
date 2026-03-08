"use client";

import { useEffect, useState } from "react";
import { UserPlus, Trash2, Shield, Clock, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [admins, setAdmins] = useState([]);
  const [logs, setLogs] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loadingId, setLoadingId] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  async function loadData() {
    try {
      const [adminRes, logRes] = await Promise.all([
        fetch("/api/admin"),
        fetch("/api/audit"),
      ]);
      setAdmins(await adminRes.json());
      setLogs(await logRes.json());
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addAdmin(e) {
    e.preventDefault();
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    setEmail("");
    setPassword("");
    loadData();
  }

  async function deleteAdmin(id) {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    await fetch(`/api/admin/${id}`, { method: "DELETE" });
    loadData();
    setLoadingId(null);
  }

  async function clearLogs() {
    if (!confirm("Permanently delete ALL audit logs?")) return;
    await fetch("/api/audit", { method: "DELETE" });
    loadData();
  }

  return (
    <div
      className="max-w-5xl mx-auto space-y-10 p-4"
      style={{ color: "#2d1a12" }}
    >
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Shield size={28} className="text-[#78350f]" /> Admin Management
      </h1>

      {/* ADD ADMIN FORM */}
      <div className="p-6 rounded-xl shadow-sm border bg-white border-[#e7e3da]">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <UserPlus size={20} /> Add Admin
        </h2>
        <form onSubmit={addAdmin} className="grid md:grid-cols-4 gap-4">
          <input
            className="border p-3 rounded-lg outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-3 rounded-lg outline-none"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="border p-3 rounded-lg cursor-pointer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button className="bg-[#78350f] text-white p-3 rounded-lg font-bold hover:bg-[#451a03] cursor-pointer">
            Create
          </button>
        </form>
      </div>

      {/* REGISTERED ADMINS LIST */}
      <div className="p-6 rounded-xl shadow-sm border bg-white border-[#e7e3da]">
        <h2 className="font-bold mb-4">Registered Admins</h2>
        <div className="divide-y">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex justify-between items-center py-4 px-2 hover:bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-semibold">{admin.email}</p>
                <span className="text-xs font-bold uppercase bg-amber-100 px-2 py-1 rounded">
                  {admin.role}
                </span>
              </div>
              <button
                onClick={() => deleteAdmin(admin.id)}
                disabled={loadingId === admin.id}
                className="text-red-500 cursor-pointer p-2"
              >
                {loadingId === admin.id ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AUDIT LOGS */}
      <div className="p-6 rounded-xl shadow-sm border bg-white border-[#e7e3da]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold flex items-center gap-2">
            <Clock size={20} /> Audit Logs
          </h2>
          {logs.length > 0 && (
            <button
              onClick={clearLogs}
              className="text-xs text-red-600 font-bold uppercase cursor-pointer hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="text-sm p-3 bg-gray-50 rounded-lg flex justify-between"
            >
              <span className="font-medium text-[#78350f]">{log.action}</span>
              <span className="text-gray-500 font-mono text-xs">
                {formatDate(log.created_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
