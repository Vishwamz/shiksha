"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth"; // Adjust path if necessary
import { useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const router = useRouter();

  const handleSignIn = async () => { // Make it async if auth is async
    if (!username || !password || !financialYear) {
      alert("Please fill in all fields."); // Or use a toast notification
      return;
    }

    const result = signIn(username, password);

    if (result.success) {
      // Store financial year in localStorage or a global state management solution
      // For simplicity, using localStorage here.
      // In Electron, you might prefer electron-store or IPC to main process for session data.
      localStorage.setItem('financialYear', financialYear);
      localStorage.setItem('isAuthenticated', 'true'); // Simple flag
      router.push("/account");
    } else {
      alert(result.message); // Or use a toast notification
      localStorage.removeItem('isAuthenticated');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-5">Sign In</h1>
      <div className="border rounded-md w-full max-w-md p-4 bg-card">
        <div className="mb-3">
          <Label htmlFor="username" className="text-base">યુઝરનેમ</Label>
          <Input
            type="text"
            id="username"
            placeholder="યુઝરનેમ"
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="password" className="text-base">પાસવર્ડ</Label>
          <Input
            type="password"
            id="password"
            placeholder="પાસવર્ડ"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="financialYear" className="text-base">નાણાકીય વર્ષ</Label>
          <select
            id="financialYear"
            className="w-full h-10 border rounded px-3 text-sm"
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
          >
            <option value="">નાણાકીય વર્ષ પસંદ કરો</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>
        <Button className="w-full h-10" onClick={handleSignIn} variant="standard">
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default SignInPage;
