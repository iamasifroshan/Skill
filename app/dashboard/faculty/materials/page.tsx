"use client";

import { useState, useEffect } from "react";
import MaterialUpload from "@/components/MaterialUpload";
import { getMaterials, type Material } from "@/lib/materialsStore";
import { Upload, BookOpen, FileText, Clock, Users } from "lucide-react";

const extIcon: Record<string, string> = {
    PDF: "📄", DOC: "📝", DOCX: "📝", PPT: "📊", PPTX: "📊",
};

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>([]);

    // Load from the shared store on mount
    useEffect(() => {
        setMaterials(getMaterials());
    }, []);

    const handleUpload = (m: Material) => {
        setMaterials((prev) => [m, ...prev]);
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 0 10px #6366f1" }} />
                    <span style={{ color: "#6366f1", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        Study Material Management
                    </span>
                </div>
                <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", color: "white" }}>
                    Upload <span style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Study Materials</span>
                </h1>
                <p style={{ color: "#64748b", marginTop: "8px" }}>
                    Materials uploaded here automatically appear in the Student Dashboard under{" "}
                    <strong style={{ color: "#94a3b8" }}>"Curriculum → Study Materials from Teacher"</strong>.
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "16px", marginBottom: "28px" }}>
                {[
                    { label: "Total Materials", value: materials.length, icon: BookOpen, color: "#6366f1" },
                    { label: "This Week", value: materials.filter(m => m.uploadedAt.includes("Feb 2")).length, icon: Upload, color: "#10b981" },
                    { label: "Classes Covered", value: new Set(materials.map(m => m.assignedClass)).size, icon: Users, color: "#a855f7" },
                    { label: "Last Upload", value: materials[0] ? "Today" : "—", icon: Clock, color: "#f59e0b" },
                ].map((s) => (
                    <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <s.icon size={20} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "white" }}>{s.value}</div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Form */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "28px", marginBottom: "28px" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Upload size={18} color="#6366f1" /> Upload New Material
                </h2>
                <MaterialUpload onUploaded={handleUpload} />
            </div>

            {/* Uploaded Materials List */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "28px" }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "white", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <FileText size={18} color="#a855f7" /> All Materials ({materials.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {materials.map((m) => (
                        <div key={m.id} style={{
                            display: "flex", alignItems: "center", gap: "16px",
                            padding: "16px 20px", background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px",
                            flexWrap: "wrap",
                        }}>
                            <div style={{ fontSize: "1.8rem" }}>{extIcon[m.fileType] || "📁"}</div>
                            <div style={{ flex: 1, minWidth: "180px" }}>
                                <div style={{ fontWeight: 700, color: "white", fontSize: "0.95rem" }}>{m.title}</div>
                                {m.description && (
                                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>{m.description}</div>
                                )}
                                <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "6px" }}>{m.fileName}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
                                <span style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700 }}>
                                    {m.assignedClass}
                                </span>
                                <span style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Clock size={11} /> {m.uploadedAt}
                                </span>
                                {m.uploadedBy && (
                                    <span style={{ fontSize: "0.7rem", color: "#475569" }}>by {m.uploadedBy}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
