
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [trustName, setTrustName] = useState("");
  const [trustAddress, setTrustAddress] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [schoolNameError, setSchoolNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [trustNameError, setTrustNameError] = useState("");
  const [trustAddressError, setTrustAddressError] = useState("");

  const calculateFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    let startYear, endYear;

    if (month >= 1 && month <= 3) {
      startYear = year - 1;
      endYear = year;
    } else {
      startYear = year;
      endYear = year + 1;
    }

    return `01/04/${startYear} to 31/03/${endYear}`;
  };

  const validateStep1 = () => {
    let isValid = true;
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!adminUsername) {
      setUsernameError("યુઝરનેમ જરૂરી છે.");
      isValid = false;
    } else if (!/^[a-z0-9]{1,10}$/.test(adminUsername)) {
      setUsernameError("યુઝરનેમ માત્ર આલ્ફાન્યૂમેરિક હોવું જોઈએ (a-z, 0-9), ૧૦ અક્ષર થી ઓછું હોવું જોઈએ.");
      isValid = false;
    }

    if (!adminPassword) {
      setPasswordError("પાસવર્ડ જરૂરી છે.");
      isValid = false;
    } else if (!/^\d{4}$/.test(adminPassword)) {
      setPasswordError("પાસવર્ડ 4 અંકોનો હોવો જોઈએ.");
      isValid = false;
    }

    if (confirmPassword !== adminPassword) {
      setConfirmPasswordError("પાસવર્ડ મેળ ખાતો નથી.");
      isValid = false;
    }

    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    setSchoolNameError("");
    setAddressError("");
    setTrustNameError("");
    setTrustAddressError("");

    if (!schoolName) {
      setSchoolNameError("શાળાનું નામ જરૂરી છે.");
      isValid = false;
    }

    if (!address) {
      setAddressError("સરનામુ જરૂરી છે.");
      isValid = false;
    }

    if (!trustName) {
      setTrustNameError("ટ્રસ્ટનું નામ જરૂરી છે.");
      isValid = false;
    }

    if (!trustAddress) {
      setTrustAddressError("ટ્રસ્ટનું સરનામુ જરૂરી છે.");
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
        setFinancialYear(calculateFinancialYear());
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSetupComplete = () => {
    // Basic setup logic
    localStorage.setItem("setupComplete", "true");
    router.push("/signin");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-5 md:mb-7">પ્રારંભિક સેટઅપ</h1>
      {step === 1 && (
        <div className="border rounded-md w-full max-w-md p-4 md:p-6">
          <h2 className="text-xl mb-3">એડમિન એકાઉન્ટ બનાવો</h2>
          <div className="mb-3">
            <Label htmlFor="username" className="text-base">યુઝરનેમ</Label>
            <Input
              id="username"
              type="text"
              placeholder="યુઝરનેમ"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
            />
            {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
          </div>
          <div className="mb-3">
            <Label htmlFor="password" className="text-base">પાસવર્ડ</Label>
            <Input
              id="password"
              type="password"
              placeholder="પાસવર્ડ"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
          <div className="mb-3">
            <Label htmlFor="confirmPassword" className="text-base">પાસવર્ડ ફરી દાખલ કરો</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="પાસવર્ડ ફરી દાખલ કરો"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
          </div>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleCancel} className="h-10 w-24">રદ કરો</Button>
            <Button onClick={handleNext} className="h-10 w-24">આગળ</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="border rounded-md w-full max-w-md p-4 md:p-6">
          <h2 className="text-xl mb-3">શાળાની વિગતો દાખલ કરો</h2>
          <div className="mb-3">
            <Label htmlFor="schoolName" className="text-base">શાળાનું નામ</Label>
            <Input
              id="schoolName"
              type="text"
              placeholder="શાળાનું નામ"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            {schoolNameError && <p className="text-red-500 text-sm">{schoolNameError}</p>}
          </div>
          <div className="mb-3">
            <Label htmlFor="address" className="text-base">સરનામુ</Label>
            <Input
              id="address"
              type="text"
              placeholder="સરનામુ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
          </div>
          <div className="mb-3">
            <Label htmlFor="phone" className="text-base">ફોન</Label>
            <Input
              id="phone"
              type="text"
              placeholder="ફોન"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="registrationNumber" className="text-base">રજી. નંબર</Label>
            <Input
              id="registrationNumber"
              type="text"
              placeholder="રજી. નંબર"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="trustName" className="text-base">ટ્રસ્ટનું નામ</Label>
            <Input
              id="trustName"
              type="text"
              placeholder="ટ્રસ્ટનું નામ"
              value={trustName}
              onChange={(e) => setTrustName(e.target.value)}
            />
             {trustNameError && <p className="text-red-500 text-sm">{trustNameError}</p>}
          </div>
          <div className="mb-3">
            <Label htmlFor="trustAddress" className="text-base">ટ્રસ્ટનું સરનામુ</Label>
            <Input
              id="trustAddress"
              type="text"
              placeholder="ટ્રસ્ટનું સરનામુ"
              value={trustAddress}
              onChange={(e) => setTrustAddress(e.target.value)}
            />
             {trustAddressError && <p className="text-red-500 text-sm">{trustAddressError}</p>}
          </div>
          <div className="flex justify-between">
            <Button onClick={handleBack} className="h-10 w-24">પાછળ</Button>
            <Button onClick={handleNext} className="h-10 w-24">આગળ</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="border rounded-md w-full max-w-md p-4 md:p-6">
          <h2 className="text-xl mb-3">નાણાકીય વર્ષની પુષ્ટિ કરો</h2>
          <p className="mb-3 text-base">નાણાકીય વર્ષ {financialYear} રહેશે</p>
          <div className="flex justify-between">
            <Button onClick={handleBack} className="h-10 w-24">પાછળ</Button>
            <Button onClick={handleSetupComplete} className="h-10 w-24">પૂર્ણ કરો</Button>
          </div>
          <Button variant="secondary" onClick={handleCancel} className="h-10 w-24 mt-3">રદ કરો</Button>
        </div>
      )}
    </div>
  );
}

export default SetupPage;
    