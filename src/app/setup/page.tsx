"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function SetupPage() {
  const [step, setStep] = useState(1);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const router = useRouter();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSetupComplete = () => {
    // Basic setup logic
    localStorage.setItem("setupComplete", "true");
    router.push("/signin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Initial Setup</h1>
      {step === 1 && (
        <div className="p-4 border rounded-md">
          <h2 className="text-lg mb-2">Create Admin Account</h2>
          <input
            type="text"
            placeholder="Username"
            className="border rounded p-2 mb-2"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded p-2 mb-2"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <button className="bg-teal-500 text-white rounded p-2" onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="p-4 border rounded-md">
          <h2 className="text-lg mb-2">Enter School Details</h2>
          <input
            type="text"
            placeholder="School Name"
            className="border rounded p-2 mb-2"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
          <button className="bg-teal-500 text-white rounded p-2" onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="p-4 border rounded-md">
          <h2 className="text-lg mb-2">Confirm Financial Year</h2>
          <p>Financial year will be from 01/04/2025 to 31/03/2026</p>
          <button className="bg-teal-500 text-white rounded p-2" onClick={handleSetupComplete}>
            Complete Setup
          </button>
        </div>
      )}
    </div>
  );
}

export default SetupPage;
