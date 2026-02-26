"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, TrendingDown, Award, AlertCircle, BookOpen, Target } from "lucide-react";
import StudentDetailsModal from "./StudentDetailsModal";

/* ── Uses CSS vars from chrome.css for theme support ── */
const V = {
    card: "var(--ds-card, rgba(255,255,255,0.025))",
    border: "var(--ds-border, rgba(255,255,255,0.06))",
    text: "var(--ds-text, #fff)",
    dim: "var(--ds-text-dim, #6b6b6b)",
    accent: "var(--ds-accent, #d4ff00)",
    accentSoft: "var(--ds-accent-soft, rgba(212,255,0,0.06))",
    accentBorder: "var(--ds-accent-border, rgba(212,255,0,0.12))",
};

const FONT_H = "var(--font-display, 'Outfit', sans-serif)";

interface StatProps {
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
    icon: any;
}

const StatCard = ({ label, value, trend, trendUp, icon: Icon }: StatProps) => (
    <div style={{
        padding: "22px", display: "flex", alignItems: "flex-start", gap: 16,
        flex: 1, minWidth: 240,
        background: V.card, border: `1px solid ${V.border}`,
        borderRadius: 16, cursor: "default",
        transition: "background 0.3s, border-color 0.3s",
    }}>
        <div style={{
            width: 42, height: 42, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: V.accentSoft, border: `1px solid ${V.accentBorder}`,
            color: V.accent, flexShrink: 0,
        }}>
            <Icon size={20} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.78rem", color: V.dim, fontWeight: 600 }}>{label}</span>
            <h3 style={{ fontFamily: FONT_H, fontSize: "1.5rem", fontWeight: 900, margin: "3px 0", color: V.text, letterSpacing: "-0.03em" }}>{value}</h3>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: trendUp ? "#10b981" : "#ef4444" }}>
                {trend} vs last month
            </span>
        </div>
    </div>
);

export default function DashboardStats({ role }: { role: string }) {
    const { data: session } = useSession();
    const [isClient, setIsClient] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [studentData, setStudentData] = useState({
        gpa: "0.0",
        skillReadiness: "0%",
        attendance: "0%",
        progress: "0%"
    });

    useEffect(() => {
        setIsClient(true);
        if (role === "STUDENT" && session?.user?.email) {
            const saved = localStorage.getItem(`skillsync-student-data-${session.user.email}`);
            if (saved) {
                setStudentData(JSON.parse(saved));
            }
        }
    }, [role, session]);

    const handleSave = (data: any) => {
        setStudentData(data);
        if (session?.user?.email) {
            localStorage.setItem(`skillsync-student-data-${session.user.email}`, JSON.stringify(data));
        }
    };

    const adminStats = [
        { label: "Total Students", value: "1,280", trend: "+12%", trendUp: true, icon: Users },
        { label: "Dropout Risk", value: "4.2%", trend: "-1.5%", trendUp: true, icon: TrendingDown },
        { label: "Employability Score", value: "82/100", trend: "+5%", trendUp: true, icon: Award },
        { label: "Alerts", value: "12", trend: "+3", trendUp: false, icon: AlertCircle },
    ];

    const facultyStats = [
        { label: "My Students", value: "145", trend: "+0", trendUp: true, icon: Users },
        { label: "Class Average", value: "78%", trend: "+2%", trendUp: true, icon: Award },
        { label: "Weak Learners", value: "9", trend: "+2", trendUp: false, icon: AlertCircle },
        { label: "Attendance", value: "92%", trend: "-2%", trendUp: false, icon: TrendingDown },
    ];

    const studentStats = [
        { label: "Academic GPA", value: studentData.gpa, trend: "+0.2", trendUp: true, icon: Award },
        { label: "Skill Readiness", value: studentData.skillReadiness, trend: "+10%", trendUp: true, icon: Target },
        { label: "Attendance", value: studentData.attendance, trend: "+2%", trendUp: true, icon: Users },
        { label: "Course Progress", value: studentData.progress, trend: "+5%", trendUp: true, icon: BookOpen },
    ];

    const stats = role === "ADMIN" ? adminStats : role === "FACULTY" ? facultyStats : studentStats;

    // Use a placeholder grid for SSR to avoid layout shift, but we only show the interactive part on client side
    return (
        <div style={{ position: "relative" }}>
            {isClient && role === "STUDENT" && (
                <button onClick={() => setShowModal(true)} style={{
                    position: "absolute", right: 0, top: "-54px",
                    background: V.accentSoft, border: `1px solid ${V.accentBorder}`, color: V.accent,
                    padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", zIndex: 10,
                    transition: "0.2s"
                }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(212,255,0,0.12)"} onMouseOut={(e) => e.currentTarget.style.background = V.accentSoft}>
                    <Award size={16} /> View Details
                </button>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 28 }}>
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>
            {isClient && showModal && <StudentDetailsModal onClose={() => setShowModal(false)} onSave={handleSave} readOnly={true} studentName={session?.user?.name || ""} studentEmail={session?.user?.email || ""} />}
        </div>
    );
}
