"use client";

import { SYSTEM_STATS, RECENT_LOGINS } from "@/lib/adminData";
import { Server, Activity, AlertTriangle, Clock, HardDrive, Cpu, Users, Wifi } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const CARD: React.CSSProperties = { background: "rgba(23,23,26,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px" };
const TT = { contentStyle: { backgroundColor: "#111114", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "0.83rem" } };

const USAGE_DATA = [
    { time: "18:00", cpu: 32, mem: 55, req: 120 },
    { time: "19:00", cpu: 41, mem: 58, req: 180 },
    { time: "20:00", cpu: 38, mem: 61, req: 145 },
    { time: "21:00", cpu: 55, mem: 63, req: 210 },
    { time: "22:00", cpu: 68, mem: 65, req: 310 },
    { time: "23:00", cpu: 72, mem: 66, req: 380 },
    { time: "00:00", cpu: 61, mem: 64, req: 290 },
    { time: "01:00", cpu: 45, mem: 62, req: 147 },
];

const ERROR_LOGS = [
    { time: "01:01 AM", level: "WARN", msg: "Rate limit hit: /api/auth endpoint — 32 requests/min" },
    { time: "12:58 AM", level: "INFO", msg: "Database backup completed successfully (4.2 MB)" },
    { time: "12:40 AM", level: "ERROR", msg: "Unknown login attempt from IP 192.168.1.90 — blocked" },
    { time: "12:30 AM", level: "INFO", msg: "Prisma connection pool refreshed — 10 connections active" },
    { time: "12:10 AM", level: "WARN", msg: "Storage usage at 43% — auto-clean scheduled" },
    { time: "11:55 PM", level: "INFO", msg: "Cron job executed: weekly performance aggregation complete" },
];

const LOG_COLOR: Record<string, string> = { ERROR: "#ef4444", WARN: "#f59e0b", INFO: "#10b981" };

export default function MonitoringPage() {
    return (
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
                    <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin · System Monitoring — Live</span>
                </div>
                <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "white", margin: 0 }}>
                    System{" "}
                    <span style={{ background: "linear-gradient(135deg,#10b981,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Monitoring</span>
                </h1>
                <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.88rem" }}>Server health, usage statistics, login activity and error logs.</p>
            </div>

            {/* Health Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "16px" }}>
                {[
                    { label: "Server Health", value: `${SYSTEM_STATS.serverHealth}%`, color: "#10b981", icon: Server, bg: "rgba(16,185,129,0.12)" },
                    { label: "Uptime", value: SYSTEM_STATS.uptime, color: "#10b981", icon: Activity, bg: "rgba(16,185,129,0.08)" },
                    { label: "Active Users", value: SYSTEM_STATS.totalActiveUsers, color: "#6366f1", icon: Users, bg: "rgba(99,102,241,0.12)" },
                    { label: "API Response", value: `${SYSTEM_STATS.apiResponseMs}ms`, color: "#a855f7", icon: Wifi, bg: "rgba(168,85,247,0.12)" },
                    { label: "Storage Used", value: `${SYSTEM_STATS.storageUsedPct}%`, color: "#f59e0b", icon: HardDrive, bg: "rgba(245,158,11,0.12)" },
                    { label: "Error Rate", value: `${SYSTEM_STATS.errorRate}%`, color: SYSTEM_STATS.errorRate > 1 ? "#ef4444" : "#10b981", icon: AlertTriangle, bg: "rgba(16,185,129,0.08)" },
                ].map(c => (
                    <div key={c.label} style={{ ...CARD, display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: 42, height: 42, borderRadius: "11px", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <c.icon size={20} color={c.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: c.color }}>{c.value}</div>
                            <div style={{ fontSize: "0.73rem", color: "#94a3b8", marginTop: "2px" }}>{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Usage charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 4px" }}>⚡ CPU & Memory Usage</h3>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 16px" }}>Last 8 hours usage percentage</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={USAGE_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="mem" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Area type="monotone" dataKey="cpu" name="CPU %" stroke="#6366f1" fill="url(#cpu)" strokeWidth={2} />
                            <Area type="monotone" dataKey="mem" name="Memory %" stroke="#a855f7" fill="url(#mem)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 4px" }}>🌐 API Request Volume</h3>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 16px" }}>Requests per hour over the last 8 hours</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={USAGE_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="req" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Area type="monotone" dataKey="req" name="Requests/hr" stroke="#10b981" fill="url(#req)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom: Login activity + Error logs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Clock size={16} color="#6366f1" /> Recent Login Activity
                    </h3>
                    {RECENT_LOGINS.map((l, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <div>
                                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>{l.name}</span>
                                <span style={{ marginLeft: "8px", fontSize: "0.72rem", color: "#64748b" }}>{l.role}</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <span style={{ fontSize: "0.72rem", color: "#475569" }}>{l.time}</span>
                                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: l.status === "Failed" ? "#ef4444" : "#10b981", background: l.status === "Failed" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "5px" }}>
                                    {l.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <AlertTriangle size={16} color="#f59e0b" /> System Event Log
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                        {ERROR_LOGS.map((log, i) => (
                            <div key={i} style={{ padding: "9px 12px", background: `${LOG_COLOR[log.level]}08`, border: `1px solid ${LOG_COLOR[log.level]}18`, borderRadius: "9px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                <span style={{ fontSize: "0.62rem", fontWeight: 900, color: LOG_COLOR[log.level], background: `${LOG_COLOR[log.level]}18`, padding: "2px 7px", borderRadius: "4px", whiteSpace: "nowrap", marginTop: "1px" }}>{log.level}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5 }}>{log.msg}</div>
                                    <div style={{ fontSize: "0.68rem", color: "#475569", marginTop: "3px" }}>{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
    );
}
