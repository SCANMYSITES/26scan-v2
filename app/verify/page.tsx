"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();

  const userId = params.get("userId");

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      setMessage("❌ Missing user ID. Restart signup.");
    }
  }, [userId]);

  async function handleVerify() {
    setMessage("");

    const res = await fetch("/api/verify-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, code }),
    });

    const data = await res.json();

    if (!data.ok) {
      setMessage("❌ Incorrect code. Try again.");
      return;
    }

    // Redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-6">
      <div className="bg-white text-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Verify Your Phone Number
        </h2>

        <p className="text-center mb-4">
          Enter the 6‑digit code sent to your phone.
        </p>

        <input
          type="text"
          placeholder="6‑digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border rounded mb-4 text-center tracking-widest text-xl"
        />

        <button
          onClick={handleVerify}
          className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Verify Code
        </button>

        {message && (
          <p className="mt-4 text-center text-red-600 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
