"use client";
import { useState } from "react";

export default function VerifyResetPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");

  // Simple password strength check
  const checkStrength = (pwd: string) => {
    if (pwd.length < 8) return "Too short";
    if (!/[A-Z]/.test(pwd)) return "Add uppercase";
    if (!/[0-9]/.test(pwd)) return "Add number";
    if (!/[!@#$%^&*]/.test(pwd)) return "Add special character";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    // Show reason if expired or invalid
if (!res.ok) {
  setMessage(data.message || "Reset failed — code may be expired or invalid.");
} else {
  setMessage(data.message);

  // Redirect after short delay
  setTimeout(() => {
    window.location.href = "/login";   // change if your login route is different
  }, 2000);
}
};

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Reset Your Password</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 border border-gray-700"
        />

        <input
          type="text"
          maxLength={6}
          placeholder="6‑digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 border border-gray-700 text-center tracking-widest text-xl"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setStrength(checkStrength(e.target.value));
            }}
            className="w-full p-3 rounded bg-slate-800 border border-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {newPassword && (
          <p
            className={`text-sm ${
              strength === "Strong" ? "text-green-400" : "text-yellow-400"
            }`}
          >
            Strength: {strength}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && <p className="mt-4 text-red-400 text-center">{message}</p>}
    </main>
  );
}
