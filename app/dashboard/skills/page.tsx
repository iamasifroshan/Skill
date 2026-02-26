import SkillRoadmap from "@/components/SkillRoadmap";
import {
    Search,
    Filter,
    ExternalLink,
    Zap,
    Clock,
    Layers
} from "lucide-react";

import "./../styles.css";

export default function SkillsPage() {
    const jobMarketAlerts = [
        { title: "MERN Stack Developer", demand: "Very High", salary: "$120k - $150k", tags: ["Remote", "Full-time"] },
        { title: "AI Integration Engineer", demand: "Emerging", salary: "$140k - $180k", tags: ["Hybrid", "New Role"] },
        { title: "DevOps Specialist", demand: "High", salary: "$110k - $140k", tags: ["On-site", "Critical"] },
    ];

    return (
        <div className="skills-page">
            <div className="page-header">
                <h1>AI Skill <span className="text-gradient">Intelligence</span></h1>
                <p>Real-time industry tracking and your alignment progress.</p>
            </div>

            <div className="skills-content-grid">
                <div className="left-column">
                    <SkillRoadmap />
                </div>

                <div className="right-column">
                    <div className="glass sidebar-section">
                        <h4 className="section-title"><Zap size={18} /> Job Market Alerts</h4>
                        <div className="job-list">
                            {jobMarketAlerts.map((job, i) => (
                                <div key={i} className="job-item">
                                    <div className="job-main">
                                        <h5>{job.title}</h5>
                                        <span className={`demand-badge ${job.demand.toLowerCase().replace(' ', '-')}`}>
                                            {job.demand}
                                        </span>
                                    </div>
                                    <div className="job-meta">
                                        <span>{job.salary}</span>
                                        <div className="job-tags">
                                            {job.tags.map(t => <span key={t}>{t}</span>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="view-all-btn">View All Matches <ExternalLink size={14} /></button>
                    </div>

                    <div className="glass sidebar-section skill-comparison">
                        <h4 className="section-title"><Layers size={18} /> Skill Map Summary</h4>
                        <div className="skill-bars">
                            {[
                                { name: "Frontend", val: 82 },
                                { name: "Backend", val: 65 },
                                { name: "Cloud", val: 40 },
                                { name: "AI/ML", val: 30 }
                            ].map(s => (
                                <div key={s.name} className="skill-row">
                                    <div className="skill-info">
                                        <span>{s.name}</span>
                                        <span>{s.val}%</span>
                                    </div>
                                    <div className="progress-bg"><div className="progress-fill" style={{ width: `${s.val}%` }}></div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
