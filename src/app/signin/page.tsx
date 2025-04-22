
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-5">Sign In</h1>
      <div className="border rounded-md w-full max-w-md p-4">
        <div className="mb-3">
          <Label htmlFor="username" className="text-base">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="password" className="text-base">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="financialYear" className="text-base">Financial Year</Label>
          <select
            id="financialYear"
            className="w-full h-10 border rounded px-3 text-sm"
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
          >
            <option value="">Select Financial Year</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>
        <Button className="w-full h-10" onClick={handleSignIn}>
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default SignInPage;
    