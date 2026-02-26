"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search, Filter, Download, ChevronUp, ChevronDown,
    Users, AlertTriangle, TrendingUp, Award
} from "lucide-react";
import type { Student } from "@/lib/mockData";

type SortKey = "name" | "roll" | "performance" | "attendance" | "risk";

const riskConfig: Record<string, { color: string; bg: string; icon: string }> = {
    Low: { color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: "●" },
    Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: "●" },
    High: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: "●" },
};

export default function StudentTable({ students }: { students: Student[] }) {
    const [query, setQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState("All");
    const [sortKey, setSortKey] = useState<SortKey>("roll");
    const [sortAsc, setSortAsc] = useState(true);

    const filtered = students
        .filter((s) =>
            (riskFilter === "All" || s.risk === riskFilter) &&
            (s.name.toLowerCase().includes(query.toLowerCase()) ||
                s.roll.toLowerCase().includes(query.toLowerCase()))
        )
        .sort((a, b) => {
            const aVal = a[sortKey] ?? "";
            const bVal = b[sortKey] ?? "";
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortAsc ? aVal - bVal : bVal - aVal;
            }
            return sortAsc
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortAsc(!sortAsc);
        else { setSortKey(key); setSortAsc(true); }
    };

    const handlePDFDownload = () => {
        const rows = filtered.map(
            (s) => `${s.roll}\t${s.name}\t${s.performance}%\t${s.attendance}%\t${s.risk}`
        ).join("\n");
        const content = `Student Performance Report\n\nRoll\tName\tPerformance\tAttendance\tRisk\n${rows}`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "student-report.txt";
        a.click();
    };

    const SortIcon = ({ k }: { k: SortKey }) =>
        sortKey === k
            ? sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
            : <ChevronDown size={14} style={{ opacity: 0.3 }} />;

    // Stats bar
    const highRisk = students.filter((s) => s.risk === "High").length;
    const avgPerf = Math.round(students.reduce((a, b) => a + b.performance, 0) / students.length);
    const avgAtt = Math.round(students.reduce((a, b) => a + b.attendance, 0) / students.length);

    return (
        <div>
            {/* Mini stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "16px", marginBottom: "28px" }}>
                {[
                    { label: "Total Students", value: students.length, icon: Users, color: "#6366f1" },
                    { label: "At High Risk", value: highRisk, icon: AlertTriangle, color: "#ef4444" },
                    { label: "Avg Performance", value: `${avgPerf}%`, icon: TrendingUp, color: "#10b981" },
                    { label: "Avg Attendance", value: `${avgAtt}%`, icon: Award, color: "#a855f7" },
                ].map((stat) => (
                    <div key={stat.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <stat.icon size={20} color={stat.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "white" }}>{stat.value}</div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "220px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "0 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Search size={16} color="#64748b" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or roll number..."
                        style={{ background: "none", border: "none", color: "white", outline: "none", padding: "11px 0", width: "100%", fontSize: "0.9rem" }}
                    />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    {["All", "Low", "Medium", "High"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRiskFilter(r)}
                            style={{
                                padding: "10px 16px",
                                borderRadius: "10px",
                                border: `1px solid ${riskFilter === r ? "#6366f1" : "rgba(255,255,255,0.08)"}`,
                                background: riskFilter === r ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                                color: riskFilter === r ? "#6366f1" : "#94a3b8",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handlePDFDownload}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#6366f1", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                >
                    <Download size={15} /> Export Report
                </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                            {([
                                { label: "Student", key: "name" },
                                { label: "Roll No", key: "roll" },
                                { label: "Performance", key: "performance" },
                                { label: "Attendance", key: "attendance" },
                                { label: "Risk Level", key: "risk" },
                                { label: "", key: null },
                            ] as { label: string; key: SortKey | null }[]).map((col) => (
                                <th
                                    key={col.label}
                                    onClick={() => col.key && toggleSort(col.key)}
                                    style={{
                                        textAlign: "left", padding: "12px 16px", color: "#64748b",
                                        fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase",
                                        letterSpacing: "0.06em", cursor: col.key ? "pointer" : "default",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        {col.label} {col.key && <SortIcon k={col.key} />}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center", padding: "48px", color: "#64748b" }}>
                                    No students found matching your search.
                                </td>
                            </tr>
                        ) : filtered.map((s, i) => {
                            const rc = riskConfig[s.risk];
                            return (
                                <tr
                                    key={s.id}
                                    style={{
                                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                                        transition: "background 0.15s",
                                    }}
                                >
                                    {/* Student */}
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0 }}>
                                                {s.avatar}
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/dashboard/faculty/student/${s.id}`}
                                                    style={{ color: "white", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}
                                                >
                                                    {s.name}
                                                </Link>
                                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{s.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Roll */}
                                    <td style={{ padding: "14px 16px", color: "#94a3b8", fontWeight: 600 }}>{s.roll}</td>

                                    {/* Performance */}
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{ flex: 1, maxWidth: "100px", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                                                <div style={{ width: `${s.performance}%`, height: "100%", background: s.performance >= 75 ? "#10b981" : s.performance >= 55 ? "#f59e0b" : "#ef4444", borderRadius: 3 }} />
                                            </div>
                                            <span style={{ fontWeight: 700, color: s.performance >= 75 ? "#10b981" : s.performance >= 55 ? "#f59e0b" : "#ef4444" }}>
                                                {s.performance}%
                                            </span>
                                        </div>
                                    </td>

                                    {/* Attendance */}
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ fontWeight: 600, color: s.attendance >= 75 ? "#94a3b8" : "#ef4444" }}>
                                            {s.attendance}%
                                        </span>
                                    </td>

                                    {/* Risk Badge */}
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ background: rc.bg, color: rc.color, padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                            {rc.icon} {s.risk}
                                        </span>
                                    </td>

                                    {/* View */}
                                    <td style={{ padding: "14px 16px" }}>
                                        <Link
                                            href={`/dashboard/faculty/student/${s.id}`}
                                            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#6366f1", padding: "6px 14px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}
                                        >
                                            View Analytics →
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
