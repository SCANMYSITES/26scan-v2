"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [accountType, setAccountType] = useState("individual");
  const [phone, setPhone] = useState("");
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        code,
        accountType,
        phone,
        termsAccepted: terms,
        privacyAccepted: privacy
      })
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message || "Verification failed.");
      return;
    }

    router.push(data.route);
  }

  async function handleResend() {
    setError("");
    setMessage("");

    const res = await fetch("/api/verify?resend=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message || "Could not resend code.");
      return;
    }

    setMessage("A new verification code has been sent.");
  }

  return (
    <div style={{ maxWidth: 450, margin: "40px auto" }}>
      <h2>Verify Your Account</h2>

      <form onSubmit={handleVerify}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="text"
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="individual">Individual</option>
          <option value="business">Business</option>
        </select>

        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label style={{ display: "block", marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
          />{" "}
          I accept the Terms of Service
        </label>

        <label style={{ display: "block", marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
          />{" "}
          I accept the Privacy Policy
        </label>

        {error && (
          <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
        )}

        {message && (
          <div style={{ color: "green", marginBottom: 10 }}>{message}</div>
        )}

        <button type="submit" style={{ width: "100%", marginBottom: 10 }}>
          Verify Account
        </button>
      </form>

      <button onClick={handleResend} style={{ width: "100%" }}>
        Resend Code
      </button>
    </div>
  );
}
