"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedType = localStorage.getItem("accountType");

    if (!storedEmail || !storedType) {
      setError("Missing email or account type. Restart login.");
      return;
    }

    setEmail(storedEmail);
    setAccountType(storedType);
  }, []);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/2fa/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    // ⭐ FIX: backend uses "success"
    if (!data.success) {
      setError(data.error || "Invalid verification code.");
      return;
    }

    // ⭐ FIX: backend uses "redirectTo"
    router.push(data.redirectTo);
  }

  async function handleResend() {
    setError("");
    setMessage("");

    const res = await fetch("/api/2fa/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, accountType }),
    });

    const data = await res.json();

    // ⭐ FIX: backend uses "ok"
    if (!data.ok) {
      setError(data.error || "Could not resend code.");
      return;
    }

    setMessage("A new verification code has been sent.");
  }

  return (
    <div style={{ maxWidth: 450, margin: "40px auto" }}>
      <h2>Enter Verification Code</h2>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        {error && (
          <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
        )}

        {message && (
          <div style={{ color: "green", marginBottom: 10 }}>{message}</div>
        )}

        <button type="submit" style={{ width: "100%", marginBottom: 10 }}>
          Verify Code
        </button>
      </form>

      <button onClick={handleResend} style={{ width: "100%" }}>
        Resend Code
      </button>
    </div>
  );
}
