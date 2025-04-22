"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const router = useRouter();

  const handleSignIn = () => {
    // Authentication logic here

    // Successful sign-in
    router.push("/account");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <div className="p-4 border rounded-md">
        <input
          type="text"
          placeholder="Username"
          className="border rounded p-2 mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded p-2 mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="border rounded p-2 mb-2"
          value={financialYear}
          onChange={(e) => setFinancialYear(e.target.value)}
        >
          <option value="">Select Financial Year</option>
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>
        <button className="bg-teal-500 text-white rounded p-2" onClick={handleSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default SignInPage;
