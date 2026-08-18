"use client";

import { useRouter } from "next/navigation";

export default function NewUserButtons() {
  const router = useRouter();

  const handleSelect = (type: "business" | "individual") => {
    localStorage.setItem("newUserAccountType", type);
    router.push("/new-account-sms");   // ← updated route
  };

  return (
    <div className="mt-8 flex space-x-4">
      <button
        onClick={() => handleSelect("business")}
        className="px-6 py-3 bg-blue-700 text-white rounded-lg text-lg hover:bg-blue-800"
      >
        Business
      </button>

      <button
        onClick={() => handleSelect("individual")}
        className="px-6 py-3 bg-green-700 text-white rounded-lg text-lg hover:bg-green-800"
      >
        Individual
      </button>

      <a
        href="/login"
        className="px-6 py-3 border border-blue-700 text-blue-700 rounded-lg text-lg hover:bg-blue-50"
      >
        Returning User
      </a>
    </div>
  );
}
