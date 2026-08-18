"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAccountSMSPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Normalize phone input BEFORE sending anywhere
  function normalizePhone(phone) {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }

    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+${cleaned}`;
    }

    if (phone.startsWith("+")) {
      return phone;
    }

    return `+${cleaned}`;
  }

  async function handleCreateAccount() {
    setMessage("");

    const normalizedPhone = normalizePhone(phone);

    // 1. Create user in your database
    const res = await fetch("/api/new-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: normalizedPhone,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      setMessage("❌ " + data.error);
      return;
    }

    const userId = data.userId;

    // 2. Send SMS verification code
    const smsRes = await fetch("/api/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        phoneNumber: normalizedPhone,
      }),
    });

    const smsData = await smsRes.json();

    if (!smsData.ok) {
      setMessage("❌ Failed to send SMS: " + smsData.error);
      return;
    }

    // 3. Redirect to verification page
    router.push(`/verify?userId=${userId}`);
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <h2>Create Your Account</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleCreateAccount}>
        Create Account
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
