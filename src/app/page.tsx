"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    // Check if the app is already set up.
    // This is a placeholder for actual logic (e.g., check database or local storage)
    const checkSetup = async () => {
      // Replace this with actual check
      const setupStatus = localStorage.getItem("setupComplete");
      setIsSetupComplete(setupStatus === "true");
    };

    checkSetup();
  }, []);

  useEffect(() => {
    if (isSetupComplete) {
      router.push("/signin");
    } else {
      router.push("/setup");
    }
  }, [isSetupComplete, router]);

  return <div>Redirecting...</div>;
}
