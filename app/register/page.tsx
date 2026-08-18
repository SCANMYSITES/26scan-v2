"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message || "Registration failed.");
      return;
    }

    router.push("/verify");
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Create your account</h2>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        {error && (
          <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
        )}

        <button type="submit" style={{ width: "100%" }}>
          Register
        </button>
      </form>
    </div>
  );
}
