"use client";

import { RETENTION_TREND, DEPARTMENTS, FACULTY_MEMBERS } from "@/lib/adminData";
import { STUDENTS } from "@/lib/mockData";
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { TrendingDown, AlertTriangle, Brain } from "lucide-react";

const TT = { contentStyle: { backgroundColor: "#111114", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "0.83rem" } };
const CARD: React.CSSProperties = { background: "rgba(23,23,26,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px" };

const AI_INSIGHTS = [
    { tag: "Alert", color: "#ef4444", text: "Retention decreased by 4% in Semester 3 — highest single-semester drop observed." },
    { tag: "Risk", color: "#f59e0b", text: "Mechanical Engineering department shows the highest at-risk rate (24 students flagged)." },
    { tag: "Trend", color: "#6366f1", text: "Semesters 5 & 6 show stabilisation — intervention programs appear to be effective." },
    { tag: "Action", color: "#10b981", text: "Early mentoring in Semester 2 could prevent 60% of Semester 3 dropout cases (AI prediction)." },
];

export default function AnalyticsPage() {
    const byDept = DEPARTMENTS.map(d => ({
        dept: d.name.split(" ")[0],
        students: d.students,
        atRisk: d.atRisk,
        retention: d.retention,
        color: d.color,
    }));

    return (
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
                    <span style={{ color: "#6366f1", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin · Retention Analytics</span>
                </div>
                <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "white", margin: 0 }}>
                    Student{" "}
                    <span style={{ background: "linear-gradient(135deg,#6366f1,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Retention Reports</span>
                </h1>
                <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.88rem" }}>AI-powered dropout prediction and semester-wise retention analysis.</p>
            </div>

            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px" }}>
                {[
                    { label: "Overall Retention", value: "89%", color: "#10b981", icon: TrendingDown },
                    { label: "Dropout This Sem", value: "11%", color: "#ef4444", icon: AlertTriangle },
                    { label: "At-Risk (AI Predicted)", value: STUDENTS.filter(s => s.risk !== "Low").length + 87, color: "#f59e0b", icon: Brain },
                    { label: "Sem 3 Drop (critical)", value: "9%", color: "#a855f7", icon: AlertTriangle },
                ].map(c => (
                    <div key={c.label} style={{ ...CARD, display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "11px", background: `${c.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <c.icon size={20} color={c.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: c.color }}>{c.value}</div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Retention + dropout line */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 4px" }}>Semester-wise Retention vs Dropout</h3>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 18px" }}>Track retention and dropout percentage across all semesters</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={RETENTION_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="sem" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "#94a3b8" }} />
                            <Line type="monotone" dataKey="rate" name="Retention %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
                            <Line type="monotone" dataKey="dropout" name="Dropout %" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Dept retention bar */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 4px" }}>Department-wise Retention</h3>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 18px" }}>Retention rate and at-risk count per department</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={byDept} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="dept" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip {...TT} />
                            <Legend wrapperStyle={{ fontSize: "0.75rem", color: "#94a3b8" }} />
                            <Bar dataKey="retention" name="Retention %" fill="#6366f1" radius={[5, 5, 0, 0]} barSize={20} />
                            <Bar dataKey="atRisk" name="At-Risk" fill="#ef4444" radius={[5, 5, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Insights */}
            <div style={CARD}>
                <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Brain size={17} color="#a855f7" /> AI Retention Insights
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px" }}>
                    {AI_INSIGHTS.map((ins, i) => (
                        <div key={i} style={{ padding: "13px 16px", background: `${ins.color}08`, border: `1px solid ${ins.color}20`, borderRadius: "12px", display: "flex", gap: "12px" }}>
                            <span style={{ background: `${ins.color}20`, color: ins.color, padding: "2px 9px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 800, whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: "2px" }}>{ins.tag}</span>
                            <p style={{ fontSize: "0.83rem", color: "#cbd5e1", lineHeight: 1.55, margin: 0 }}>{ins.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dept detail table */}
            <div style={CARD}>
                <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 18px" }}>Department Retention Details</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                            {["Department", "Total Students", "Avg Performance", "Retention Rate", "At-Risk", "Status"].map(h => (
                                <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#475569", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DEPARTMENTS.map((d, i) => (
                            <tr key={d.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                                        <span style={{ fontWeight: 700, color: "white" }}>{d.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "12px 14px", color: "#94a3b8" }}>{d.students}</td>
                                <td style={{ padding: "12px 14px", color: d.avgPerf >= 70 ? "#10b981" : "#f59e0b", fontWeight: 700 }}>{d.avgPerf}%</td>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ width: 60, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                                            <div style={{ width: `${d.retention - 75}px`, height: "100%", background: d.retention >= 90 ? "#10b981" : d.retention >= 85 ? "#f59e0b" : "#ef4444" }} />
                                        </div>
                                        <span style={{ fontWeight: 700, color: d.retention >= 90 ? "#10b981" : d.retention >= 85 ? "#f59e0b" : "#ef4444" }}>{d.retention}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: "12px 14px", color: "#ef4444", fontWeight: 700 }}>{d.atRisk}</td>
                                <td style={{ padding: "12px 14px" }}>
                                    <span style={{ background: d.retention >= 90 ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: d.retention >= 90 ? "#10b981" : "#f59e0b", padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 800 }}>
                                        {d.retention >= 90 ? "Stable" : "Monitor"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
