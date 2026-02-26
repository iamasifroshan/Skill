"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                setLoading(false);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (err) {
            setError("Failed to connect to server");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-page">
                <div className="login-grid-bg" aria-hidden="true" />
                <div className="login-card" style={{ textAlign: "center" }}>
                    <div className="success-icon">
                        <CheckCircle2 size={48} color="#d4ff00" />
                    </div>
                    <h1 style={{ color: "white", marginBottom: "8px" }}>Account Created!</h1>
                    <p style={{ color: "#6b6b6b" }}>Redirecting you to sign in...</p>
                </div>
                <style jsx>{`
                    .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; position: relative; overflow: hidden; }
                    .login-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 64px 64px; }
                    .login-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 40px; position: relative; z-index: 2; width: 100%; max-width: 420px; }
                    .success-icon { margin-bottom: 24px; animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    @keyframes scaleUp { from { transform: scale(0); } to { transform: scale(1); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-grid-bg" aria-hidden="true" />
            <div className="login-glow" aria-hidden="true" />

            <Link href="/" className="login-back">
                <GraduationCap size={16} />
                SkillSync
            </Link>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo-mark">
                        <GraduationCap size={28} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join SkillSync and start your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="login-field">
                        <label>
                            <User size={14} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label>
                            <Mail size={14} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label>
                            <Lock size={14} />
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 size={18} className="spin" />
                        ) : (
                            <>
                                Create Account <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer" style={{ marginTop: "24px", textAlign: "center", fontSize: "0.88rem" }}>
                    <span style={{ color: "#6b6b6b" }}>Already have an account? </span>
                    <Link href="/login" style={{ color: "#d4ff00", fontWeight: 700, textDecoration: "none" }}>
                        Sign In
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; padding: 24px; position: relative; overflow: hidden; font-family: 'Space Grotesk', sans-serif; }
                .login-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 64px 64px; pointer-events: none; }
                .login-glow { position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(50% 50% at 50% 50%, rgba(212, 255, 0, 0.08) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
                .login-back { position: absolute; top: 28px; left: 32px; display: flex; align-items: center; gap: 8px; font-weight: 800; color: #fff; text-decoration: none; transition: opacity 0.2s; }
                .login-back :global(svg) { color: #d4ff00; }
                .login-card { width: 100%; max-width: 420px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 40px; position: relative; z-index: 2; }
                .login-header { text-align: center; margin-bottom: 32px; }
                .login-logo-mark { width: 56px; height: 56px; background: #0a0a0a; border: 1.5px solid rgba(255, 255, 255, 0.1); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
                .login-logo-mark :global(svg) { color: #d4ff00; }
                .login-header h1 { font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 900; color: #fff; margin-bottom: 6px; }
                .login-header p { font-size: 0.88rem; color: #6b6b6b; }
                .login-form { display: flex; flex-direction: column; gap: 18px; }
                .login-error { background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; padding: 12px 14px; border-radius: 10px; font-size: 0.83rem; }
                .login-field label { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 600; color: #6b6b6b; margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.08em; }
                .login-field input { width: 100%; background: rgba(255, 255, 255, 0.04); border: 1.5px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 13px 16px; color: #fff; font-size: 0.95rem; outline: none; }
                .login-field input:focus { border-color: #d4ff00; box-shadow: 0 0 0 3px rgba(212, 255, 0, 0.1); }
                .login-submit { width: 100%; margin-top: 6px; background: #d4ff00; color: #0a0a0a; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.25s; }
                .login-submit:hover { background: #0a0a0a; color: #d4ff00; box-shadow: 0 0 0 2px #d4ff00; transform: translateY(-1px); }
                .spin { animation: spinner 0.8s linear infinite; }
                @keyframes spinner { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
