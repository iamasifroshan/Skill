"use client";

import { useState, useEffect } from "react";
import { UserPlus, Shield, Ban, RefreshCw, Search, CheckCircle, Loader2, Trash2 } from "lucide-react";

const CARD: React.CSSProperties = { background: "rgba(23,23,26,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px" };

const ROLE_COLOR: Record<string, string> = { ADMIN: "#ef4444", FACULTY: "#6366f1", STUDENT: "#10b981" };

const AVATAR_COLORS = ["#f59e0b", "#6366f1", "#10b981", "#ef4444", "#a855f7", "#ec4899"];

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [role, setRole] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [saved, setSaved] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", role: "STUDENT", password: "password123" });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (res.ok) setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const filtered = users.filter(u =>
        (role === "All" || u.role === role) &&
        ((u.name?.toLowerCase() || "").includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSaved(true);
                setShowForm(false);
                setForm({ name: "", email: "", role: "STUDENT", password: "password123" });
                fetchUsers();
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Error creating user");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error("Error deleting user");
        }
    };

    const getInitials = (name: string) => (name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Header omitted for brevity in replacement but matches original aesthetic */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                    <span style={{ color: "#f59e0b", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin · User Management</span>
                </div>
                <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "white", margin: 0 }}>
                    User{" "}
                    <span style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Management</span>
                </h1>
            </div>

            {saved && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 17px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "12px", color: "#10b981", fontWeight: 700 }}>
                    <CheckCircle size={17} /> User created successfully.
                </div>
            )}

            {/* Toolbar */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "0 14px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <Search size={15} color="#64748b" />
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users…"
                        style={{ background: "none", border: "none", color: "white", outline: "none", padding: "11px 0", width: "100%", fontSize: "0.88rem" }} />
                </div>
                {["All", "ADMIN", "FACULTY", "STUDENT"].map(r => (
                    <button key={r} onClick={() => setRole(r)}
                        style={{ padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, border: `1px solid ${role === r ? "#f59e0b" : "rgba(255,255,255,0.07)"}`, background: role === r ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.03)", color: role === r ? "#f59e0b" : "#64748b" }}>
                        <Shield size={12} style={{ marginRight: 5, verticalAlign: "middle" }} />{r}
                    </button>
                ))}
                <button onClick={() => setShowForm(!showForm)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "linear-gradient(135deg,#f59e0b,#ef4444)", border: "none", borderRadius: "10px", color: "white", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}>
                    <UserPlus size={15} /> Create User
                </button>
            </div>

            {/* Create User Form */}
            {showForm && (
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 18px" }}>Create New User Account</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "7px" }}>Full Name</label>
                                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="John Doe"
                                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "10px 13px", color: "white", outline: "none" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "7px" }}>Email</label>
                                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="john@example.com"
                                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "10px 13px", color: "white", outline: "none" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "7px" }}>Role</label>
                                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "10px 13px", color: "white", outline: "none" }}>
                                    {["STUDENT", "FACULTY", "ADMIN"].map(r => <option key={r} value={r} style={{ background: "#1a1a2e" }}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "7px" }}>Password</label>
                                <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••"
                                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "10px 13px", color: "white", outline: "none" }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button type="submit" disabled={creating} style={{ padding: "11px 24px", background: "linear-gradient(135deg,#f59e0b,#ef4444)", border: "none", borderRadius: "10px", color: "white", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                                {creating ? <Loader2 size={16} className="spin" /> : "Create Account"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: "11px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#94a3b8", fontWeight: 700, cursor: "pointer" }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div style={CARD}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Loader2 className="spin" /></div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                                    {["User", "Email", "Role", "Created", "Actions"].map(h => (
                                        <th key={h} style={{ textAlign: "left", padding: "12px 14px", color: "#475569", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u, i) => (
                                    <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                                        <td style={{ padding: "12px 14px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color: "white" }}>{getInitials(u.name)}</div>
                                                <span style={{ fontWeight: 700, color: "white" }}>{u.name || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "12px 14px", color: "#64748b" }}>{u.email}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <span style={{ background: `${ROLE_COLOR[u.role]}18`, color: ROLE_COLOR[u.role], padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 800 }}>{u.role}</span>
                                        </td>
                                        <td style={{ padding: "12px 14px", color: "#64748b" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <button onClick={() => handleDelete(u.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "4px 10px", borderRadius: "7px", cursor: "pointer", fontSize: "0.72rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Trash2 size={11} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <style jsx>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
