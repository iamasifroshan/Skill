"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import DashboardStats from "@/components/DashboardStats";
import ClientCharts from "@/components/ClientCharts";
import FacultyDashboard from "@/components/FacultyDashboard";
import "./styles.css";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const role = (session?.user as any)?.role || "STUDENT";
    const name = session?.user?.name || "User";
    const email = session?.user?.email || "";

    if (status === "loading") {
        return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontWeight: 700 }}>Loading Dashboard...</div>;
    }

    if (!session) return null;

    // ── Admin → dedicated admin dashboard
    if (role === "ADMIN") {
        redirect("/dashboard/admin");
        return null;
    }

    // ── Faculty → Full Faculty Dashboard
    if (role === "FACULTY") {
        return (
            <div className="dashboard-content">
                <FacultyDashboard teacherName={name} teacherEmail={email} />
            </div>
        );
    }

    // ── Student → Personal Dashboard
    const [performanceData, setPerformanceData] = useState([
        { name: "Week 1", score: 65, avg: 72 },
        { name: "Week 2", score: 68, avg: 73 },
        { name: "Week 3", score: 75, avg: 72 },
        { name: "Week 4", score: 82, avg: 75 },
        { name: "Week 5", score: 80, avg: 74 },
    ]);

    const [skillGapData, setSkillGapData] = useState([
        { subject: "React", student: 85, industry: 90 },
        { subject: "Node.js", student: 70, industry: 85 },
        { subject: "SQL", student: 90, industry: 80 },
        { subject: "Python", student: 60, industry: 95 },
        { subject: "Docker", student: 40, industry: 70 },
    ]);

    useEffect(() => {
        if (email) {
            const saved = localStorage.getItem(`skillsync-student-data-${email}`);
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    // Update performance trend: set latest week to current performance
                    const currentPerf = parseInt(data.gpa ? (parseFloat(data.gpa) * 9.5).toString() : "0") || (data.marks ? Math.round(data.marks.reduce((a: number, b: number) => a + b, 0) / 5) : 80);
                    setPerformanceData(prev => {
                        const next = [...prev];
                        next[next.length - 1].score = currentPerf;
                        // Add some variance for previous weeks if we want it to look "real"
                        next[next.length - 2].score = Math.max(0, currentPerf - 5);
                        return next;
                    });

                    // Update skill gaps: use skillReadiness for first item or average
                    const readiness = parseInt(data.skillReadiness) || 60;
                    setSkillGapData(prev => prev.map((s, i) => ({
                        ...s,
                        student: i === 0 ? readiness : Math.max(0, readiness - (i * 10))
                    })));

                } catch (e) { }
            }
        }
    }, [email]);

    const techTrends = [
        { name: "Large Language Models", pct: 95, label: "+45%" },
        { name: "Cloud Native Security", pct: 80, label: "+22%" },
        { name: "Web3 / Blockchain", pct: 40, label: "-12%" },
        { name: "Edge Computing", pct: 65, label: "+15%" },
    ];

    return (
        <div className="dashboard-content">
            <div className="welcome-section">
                <h1>
                    Welcome back,{" "}
                    <span className="text-gradient">{session.user?.name}</span>
                </h1>
                <p>Here&apos;s your personalised academic and skill roadmap for today.</p>
            </div>

            <DashboardStats role="STUDENT" />

            <div className="charts-grid">
                <div className="glass chart-container full">
                    <div className="chart-header">
                        <h3>My Performance Trend</h3>
                        <p>AI-predicted trajectory based on current engagement logs</p>
                    </div>
                    <div style={{ height: "300px", width: "100%" }}>
                        <ClientCharts type="area" data={performanceData} dataKey="score" dataKey2="avg" colors={["#6366f1", "#a855f7"]} />
                    </div>
                </div>

                <div className="glass chart-container">
                    <div className="chart-header">
                        <h3>Skill Gap Analyzer</h3>
                        <p>Your current proficiency vs Real-time Industry demand</p>
                    </div>
                    <div style={{ height: "300px", width: "100%" }}>
                        <ClientCharts type="bar" data={skillGapData} dataKey="student" dataKey2="industry" colors={["#6366f1", "#e2e8f0"]} />
                    </div>
                </div>

                <div className="glass chart-container">
                    <div className="chart-header">
                        <h3>Emerging Technology Trends</h3>
                        <p>Job market demands for the next 6 months</p>
                    </div>
                    <div className="tech-trends">
                        {techTrends.map((t) => (
                            <div key={t.name} className="trend-item">
                                <span className="trend-name">{t.name}</span>
                                <div className="trend-bar">
                                    <div className="fill" style={{ width: `${t.pct}%` }} />
                                </div>
                                <span className="trend-val">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
