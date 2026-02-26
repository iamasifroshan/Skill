"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

const V = {
    bg: "rgba(10, 10, 10, 0.8)",
    card: "var(--ds-card, rgba(255,255,255,0.05))",
    border: "var(--ds-border, rgba(255,255,255,0.06))",
    text: "var(--ds-text, #fff)",
    dim: "var(--ds-text-dim, #6b6b6b)",
    accent: "var(--ds-accent, #d4ff00)",
};

const SUBJECTS = ["Math", "Data Structures", "DBMS", "Networks", "OS"];

export default function StudentDetailsModal({
    onClose,
    onSave,
    readOnly = false,
    studentName = "",
    studentEmail = ""
}: {
    onClose: () => void;
    onSave: (data: any) => void;
    readOnly?: boolean;
    studentName?: string;
    studentEmail?: string;
}) {
    const [marks, setMarks] = useState([0, 0, 0, 0, 0]);
    const [attendance, setAttendance] = useState(0);
    const [skills, setSkills] = useState(0);
    const [progress, setProgress] = useState(0);
    const [syllabusProgress, setSyllabusProgress] = useState(0);
    const [skillGaps, setSkillGaps] = useState("");

    useEffect(() => {
        if (studentEmail) {
            const saved = localStorage.getItem(`skillsync-student-data-${studentEmail}`);
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    if (data.marks && Array.isArray(data.marks)) setMarks(data.marks);
                    else setMarks([0, 0, 0, 0, 0]);

                    setAttendance(parseInt(data.attendance) || 0);
                    setSkills(parseInt(data.skillReadiness) || 0);
                    setProgress(parseInt(data.progress) || 0);
                    setSyllabusProgress(data.syllabusProgress || 0);
                    setSkillGaps(Array.isArray(data.skillGaps) ? data.skillGaps.join(", ") : (data.skillGaps || ""));
                    return;
                } catch (e) { console.error(e); }
            }
        }
        // Cleanup / Default if no record
        setMarks([0, 0, 0, 0, 0]);
        setAttendance(0);
        setSkills(0);
        setProgress(0);
        setSyllabusProgress(0);
        setSkillGaps("");
    }, [studentEmail]);

    const handleSave = () => {
        const total = marks.reduce((a, b) => a + b, 0);
        const percentage = total / 5;
        // Simple CGPA calculation: percentage / 9.5
        const gpa = (percentage / 9.5).toFixed(1);

        onSave({
            gpa: parseFloat(gpa) > 10 ? "10.0" : gpa,
            skillReadiness: `${skills}%`,
            attendance: `${attendance}%`,
            progress: `${progress}%`,
            marks: marks,
            syllabusProgress,
            skillGaps: skillGaps.split(",").map(s => s.trim()).filter(Boolean),
        });
        onClose();
    };

    const handleMarkChange = (index: number, val: number) => {
        const newMarks = [...marks];
        newMarks[index] = val;
        setMarks(newMarks);
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
            <div style={{
                background: "#0a0a0a", border: `1px solid ${V.border}`, borderRadius: "16px",
                padding: "24px", width: "480px", maxWidth: "95%", color: V.text,
                display: "flex", flexDirection: "column", gap: "16px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)", maxHeight: "90vh", overflowY: "auto"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                        {readOnly ? "View Student Details" : `Update Details: ${studentName}`}
                    </h3>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", color: V.dim, cursor: "pointer" }}><X size={20} /></button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
                    <div>
                        <label style={{ fontSize: "0.85rem", color: V.dim, fontWeight: 500 }}>Subject Marks (out of 100)</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
                            {SUBJECTS.map((sub, i) => (
                                <div key={sub} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                    <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{sub}</span>
                                    <input type="number" max="100" min="0"
                                        value={marks[i] || ""}
                                        readOnly={readOnly}
                                        onChange={(e) => handleMarkChange(i, parseInt(e.target.value) || 0)}
                                        style={{ width: "60px", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "6px", borderRadius: "6px", textAlign: "center" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                            <label style={{ fontSize: "0.82rem", color: V.dim, fontWeight: 500 }}>Attendance %</label>
                            <input type="number" max="100" min="0" value={attendance || ""} readOnly={readOnly} onChange={e => setAttendance(parseInt(e.target.value) || 0)}
                                style={{ width: "100%", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "8px", borderRadius: "6px", marginTop: "4px", textAlign: "center" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.82rem", color: V.dim, fontWeight: 500 }}>Skill Readiness %</label>
                            <input type="number" max="100" min="0" value={skills || ""} readOnly={readOnly} onChange={e => setSkills(parseInt(e.target.value) || 0)}
                                style={{ width: "100%", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "8px", borderRadius: "6px", marginTop: "4px", textAlign: "center" }} />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                            <label style={{ fontSize: "0.82rem", color: V.dim, fontWeight: 500 }}>Course Progress %</label>
                            <input type="number" max="100" min="0" value={progress || ""} readOnly={readOnly} onChange={e => setProgress(parseInt(e.target.value) || 0)}
                                style={{ width: "100%", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "8px", borderRadius: "6px", marginTop: "4px", textAlign: "center" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.82rem", color: V.dim, fontWeight: 500 }}>Syllabus Progress %</label>
                            <input type="number" max="100" min="0" value={syllabusProgress || ""} readOnly={readOnly} onChange={e => setSyllabusProgress(parseInt(e.target.value) || 0)}
                                style={{ width: "100%", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "8px", borderRadius: "6px", marginTop: "4px", textAlign: "center" }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: "0.82rem", color: V.dim, fontWeight: 500 }}>Skill Gaps (comma separated)</label>
                        <input type="text" value={skillGaps} readOnly={readOnly} onChange={e => setSkillGaps(e.target.value)} placeholder="e.g. Recursion, SQL Joins"
                            style={{ width: "100%", background: V.card, border: `1px solid ${V.border}`, color: V.text, padding: "8px", borderRadius: "6px", marginTop: "4px" }} />
                    </div>
                </div>

                {!readOnly && (
                    <button onClick={handleSave} style={{
                        background: V.accent, color: "#111", border: "none", padding: "12px", borderRadius: "8px",
                        fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        marginTop: "12px", cursor: "pointer", transition: "0.2s opacity", fontSize: "0.9rem"
                    }} onMouseOver={e => e.currentTarget.style.opacity = "0.9"} onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                        <Save size={18} /> Save & Sync Dashboard
                    </button>
                )}
            </div>
        </div>
    );
}
