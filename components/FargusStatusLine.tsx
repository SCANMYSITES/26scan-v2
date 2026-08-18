"use client";

import { useEffect, useState } from "react";

export default function FargusStatusLine() {
  const [status, setStatus] = useState<string>("Loading FARGUS status...");

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/fargus/status");
        const data = await res.json();

        if (data?.message) {
          setStatus(data.message);
        } else {
          setStatus("No recent FARGUS events.");
        }
      } catch {
        setStatus("Unable to load FARGUS status.");
      }
    }

    loadStatus();
  }, []);

  return (
    <div className="p-4 rounded-md bg-blue-900 text-white shadow-md">
      <strong>FARGUS Status:</strong> {status}
    </div>
  );
}
