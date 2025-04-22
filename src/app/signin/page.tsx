"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

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
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-5">
      <h1 className="text-4xl font-bold mb-7">Sign In</h1>
      <div className="p-6 border rounded-md w-full max-w-md">
        <Input
          type="text"
          placeholder="Username"
          className="border rounded p-3 mb-5 w-full text-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          className="border rounded p-3 mb-5 w-full text-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="border rounded p-3 mb-5 w-full text-lg"
          value={financialYear}
          onChange={(e) => setFinancialYear(e.target.value)}
        >
          <option value="">Select Financial Year</option>
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>
        <Button className="h-12 text-lg" onClick={handleSignIn}>
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default SignInPage;
