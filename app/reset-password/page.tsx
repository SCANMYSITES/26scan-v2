"use client";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function sendCode() {
    const res = await fetch("/api/send-email-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    // Guardrail: user must exist
    if (!res.ok && data.message?.includes("No account found")) {
      setMessage("No account found. Please complete New User Setup first.");
      return;
    }

    // Normal behavior
    if (data.success) {
      setMessage("Reset code sent! Check your email.");
    } else {
      setMessage(data.message || "Failed to send reset code.");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-full mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={sendCode}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send Reset Code
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
