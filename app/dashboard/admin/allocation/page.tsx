"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, UserCheck, RefreshCw, CheckCircle, Search, ChevronRight } from "lucide-react";
import { STUDENTS } from "@/lib/mockData";
import { FACULTY_MEMBERS } from "@/lib/adminData";
import { getAllocations, saveAllocations, bulkAssign, getStudentsForFaculty, getFacultiesForStudent, unassignStudent } from "@/lib/allocationStore";

const CARD: React.CSSProperties = {
    background: "rgba(23,23,26,0.7)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px",
};

export default function AllocationPage() {
    const [allocations, setAllocations] = useState<{ facultyId: string; studentIds: string[] }[]>([]);
    const [selectedFaculty, setSelectedFaculty] = useState(FACULTY_MEMBERS[0].id);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [query, setQuery] = useState("");
    const [saved, setSaved] = useState(false);
    const [activeFilter, setActiveFilter] = useState<"all" | "assigned" | "unassigned">("all");

    const reload = useCallback(() => { setAllocations(getAllocations()); }, []);
    useEffect(() => { reload(); }, [reload]);

    const assignedToSelected = getStudentsForFaculty(selectedFaculty);

    const filteredStudents = STUDENTS.filter(s => {
        const matchQ = s.name.toLowerCase().includes(query.toLowerCase()) || s.roll.toLowerCase().includes(query.toLowerCase());
        const assigned = assignedToSelected.includes(s.id);
        if (activeFilter === "assigned") return matchQ && assigned;
        if (activeFilter === "unassigned") return matchQ && !assigned;
        return matchQ;
    });

    const toggleStudent = (id: string) => {
        setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleAssign = () => {
        bulkAssign(selectedStudents, selectedFaculty);
        reload();
        setSelectedStudents([]);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleUnassign = (studentId: string) => {
        unassignStudent(studentId, selectedFaculty);
        reload();
    };

    const currentFaculty = FACULTY_MEMBERS.find(f => f.id === selectedFaculty)!;
    const assignedCount = allocations.find(a => a.facultyId === selectedFaculty)?.studentIds.length ?? 0;

    return (
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* Header */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin · Student Allocation</span>
                </div>
                <h1 style={{ fontSize: "1.9rem", fontWeight: 900, color: "white", margin: 0 }}>
                    Student{" "}
                    <span style={{ background: "linear-gradient(135deg,#10b981,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Allocation</span>
                </h1>
                <p style={{ color: "#64748b", marginTop: "6px", fontSize: "0.88rem" }}>Assign students to faculty members. Changes reflect in faculty dashboards in real-time.</p>
            </div>

            {saved && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "12px", color: "#10b981", fontWeight: 700 }}>
                    <CheckCircle size={17} /> Allocation saved! Faculty dashboard will reflect the changes immediately.
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>

                {/* Faculty Panel */}
                <div style={CARD}>
                    <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <UserCheck size={16} color="#6366f1" /> Select Faculty
                    </h3>
                    {FACULTY_MEMBERS.map(f => {
                        const count = allocations.find(a => a.facultyId === f.id)?.studentIds.length ?? 0;
                        const active = selectedFaculty === f.id;
                        return (
                            <div key={f.id} onClick={() => { setSelectedFaculty(f.id); setSelectedStudents([]); setActiveFilter("all"); }}
                                style={{
                                    display: "flex", alignItems: "center", gap: "12px", padding: "13px 14px", borderRadius: "12px", cursor: "pointer", marginBottom: "8px",
                                    background: active ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                                    border: `1px solid ${active ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.05)"}`,
                                }}>
                                <div style={{ width: 38, height: 38, borderRadius: "50%", background: f.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", flexShrink: 0 }}>{f.avatar}</div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontWeight: 700, color: "white", fontSize: "0.88rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{f.dept}</div>
                                </div>
                                <div style={{ textAlign: "center", minWidth: 32 }}>
                                    <div style={{ fontSize: "1rem", fontWeight: 800, color: active ? "#6366f1" : "white" }}>{count}</div>
                                    <div style={{ fontSize: "0.6rem", color: "#64748b" }}>students</div>
                                </div>
                                {active && <ChevronRight size={14} color="#6366f1" />}
                            </div>
                        );
                    })}
                    {/* Allocation summary */}
                    <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Total Allocations</div>
                        {FACULTY_MEMBERS.map(f => {
                            const count = allocations.find(a => a.facultyId === f.id)?.studentIds.length ?? 0;
                            const pct = Math.round(count / STUDENTS.length * 100);
                            return (
                                <div key={f.id} style={{ marginBottom: "8px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "3px" }}>
                                        <span>{f.name.split(" ").slice(-1)[0]}</span><span>{count}</span>
                                    </div>
                                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                                        <div style={{ width: `${pct}%`, height: "100%", background: f.avatarColor, borderRadius: 2 }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Student Assignment Panel */}
                <div style={CARD}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                            <h3 style={{ fontWeight: 800, color: "white", fontSize: "0.95rem", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: currentFaculty.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem" }}>{currentFaculty.avatar}</div>
                                {currentFaculty.name}
                            </h3>
                            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>{currentFaculty.dept} · {assignedCount} students assigned</p>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {selectedStudents.length > 0 && (
                                <button onClick={handleAssign}
                                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "linear-gradient(135deg,#10b981,#6366f1)", border: "none", borderRadius: "10px", color: "white", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}>
                                    <CheckCircle size={15} /> Assign {selectedStudents.length} Student{selectedStudents.length > 1 ? "s" : ""}
                                </button>
                            )}
                            <button onClick={reload}
                                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#94a3b8", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                                <RefreshCw size={13} /> Refresh
                            </button>
                        </div>
                    </div>

                    {/* Filters + Search */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "180px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "9px", padding: "0 12px", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <Search size={14} color="#64748b" />
                            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students…"
                                style={{ background: "none", border: "none", color: "white", outline: "none", padding: "10px 0", width: "100%", fontSize: "0.85rem" }} />
                        </div>
                        {(["all", "assigned", "unassigned"] as const).map(f => (
                            <button key={f} onClick={() => setActiveFilter(f)}
                                style={{ padding: "9px 15px", borderRadius: "9px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, border: `1px solid ${activeFilter === f ? "#10b981" : "rgba(255,255,255,0.07)"}`, background: activeFilter === f ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)", color: activeFilter === f ? "#10b981" : "#64748b" }}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Student list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "480px", overflowY: "auto" }}>
                        {filteredStudents.map(s => {
                            const isAssigned = assignedToSelected.includes(s.id);
                            const isSelected = selectedStudents.includes(s.id);
                            const rc = s.risk === "High" ? "#ef4444" : s.risk === "Medium" ? "#f59e0b" : "#10b981";
                            return (
                                <div key={s.id}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "11px", cursor: "pointer",
                                        background: isSelected ? "rgba(16,185,129,0.08)" : isAssigned ? "rgba(99,102,241,0.05)" : "rgba(255,255,255,0.02)",
                                        border: `1px solid ${isSelected ? "rgba(16,185,129,0.4)" : isAssigned ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)"}`,
                                    }}
                                    onClick={() => !isAssigned && toggleStudent(s.id)}
                                >
                                    {/* Checkbox */}
                                    <div style={{ width: 18, height: 18, borderRadius: "5px", border: `2px solid ${isSelected ? "#10b981" : isAssigned ? "#6366f1" : "rgba(255,255,255,0.15)"}`, background: isSelected ? "#10b981" : isAssigned ? "rgba(99,102,241,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {(isSelected || isAssigned) && <span style={{ color: "white", fontSize: "0.65rem", fontWeight: 900 }}>✓</span>}
                                    </div>
                                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: s.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}>{s.avatar}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: "white", fontSize: "0.88rem" }}>{s.name}</div>
                                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                                            {s.roll} · Perf: {s.performance}% · Att: {s.attendance}%
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px", minWidth: "120px" }}>
                                        <span style={{ background: `${rc}15`, color: rc, padding: "2px 8px", borderRadius: "6px", fontSize: "0.68rem", fontWeight: 800 }}>● {s.risk}</span>
                                        {isAssigned ? (
                                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                                <span style={{ fontSize: "0.68rem", color: "#6366f1", fontWeight: 700 }}>Assigned ✓</span>
                                                <button onClick={e => { e.stopPropagation(); handleUnassign(s.id); }}
                                                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "2px 7px", borderRadius: "5px", fontSize: "0.65rem", cursor: "pointer", fontWeight: 700 }}>
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-end" }}>
                                                {getFacultiesForStudent(s.id).length > 0 ? (
                                                    getFacultiesForStudent(s.id).map(fid => (
                                                        <span key={fid} style={{ fontSize: "0.6rem", color: "#475569", background: "rgba(255,255,255,0.03)", padding: "1px 4px", borderRadius: 3 }}>
                                                            {FACULTY_MEMBERS.find(f => f.id === fid)?.name.split(" ").slice(-1)}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span style={{ fontSize: "0.68rem", color: "#475569" }}>Unassigned</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {filteredStudents.length === 0 && (
                            <div style={{ textAlign: "center", padding: "48px", color: "#64748b", fontSize: "0.88rem" }}>No students found.</div>
                        )}
                    </div>

                    {selectedStudents.length > 0 && (
                        <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 700 }}>{selectedStudents.length} student(s) selected</span>
                            <button onClick={() => setSelectedStudents([])} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.8rem" }}>Clear</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
