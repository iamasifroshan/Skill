"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";

export default function WeakLearnerAlerts() {
  const alerts = [
    { name: "Alex Johnson", email: "alex@student.com", grade: "48%", attendance: "62%", risk: "High" },
    { name: "John Doe", email: "john@student.com", grade: "52%", attendance: "71%", risk: "Medium" },
  ];

  return (
    <div style={{
      padding: "24px",
      marginTop: "24px",
      background: "rgba(23,23,26,0.7)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <AlertTriangle color="#ef4444" size={20} />
          <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", margin: 0 }}>
            Early Intervention Alerts
          </h4>
        </div>
        <span style={{
          background: "rgba(239,68,68,0.1)",
          color: "#f87171",
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "0.75rem",
          fontWeight: 700,
        }}>
          2 Students at Risk
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {alerts.map((alert, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "160px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#6366f1", display: "flex", alignItems: "center",
                justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0,
              }}>
                {alert.name[0]}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "white" }}>{alert.name}</span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{alert.email}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Grade</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f87171" }}>{alert.grade}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Attendance</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "white" }}>{alert.attendance}</span>
              </div>
            </div>

            <button style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white", padding: "8px 16px", borderRadius: "8px",
              fontSize: "0.85rem", fontWeight: 600, display: "flex",
              alignItems: "center", gap: "8px", cursor: "pointer",
            }}>
              Reach Out <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
