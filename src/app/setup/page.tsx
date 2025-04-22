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
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-5">{/* Increased padding */}
      <h1 className="text-4xl font-bold mb-7">પ્રારંભિક સેટઅપ</h1>{/* Increased font size and margin */}
      {step === 1 && (
        <div className="p-6 border rounded-md w-full max-w-md"> {/* Increased padding */}
          <h2 className="text-2xl mb-3">એડમિન એકાઉન્ટ બનાવો</h2>{/* Increased font size and margin */}
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="username" className="text-lg">યુઝરનેમ</Label>{/* Increased font size */}
            <Input
              id="username"
              type="text"
              placeholder="યુઝરનેમ"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="text-lg"/* Increased font size */
            />
            {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
          </div>
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="password" className="text-lg">પાસવર્ડ</Label>{/* Increased font size */}
            <Input
              id="password"
              type="password"
              placeholder="પાસવર્ડ"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="text-lg"/* Increased font size */
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          </div>
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="confirmPassword" className="text-lg">પાસવર્ડ ફરી દાખલ કરો</Label>{/* Increased font size */}
            <Input
              id="confirmPassword"
              type="password"
              placeholder="પાસવર્ડ ફરી દાખલ કરો"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-lg"/* Increased font size */
            />
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
          </div>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleCancel} className="h-12 w-32 text-lg">રદ કરો</Button>{/* Increased height, width and font size */}
            <Button onClick={handleNext} className="h-12 w-32 text-lg">આગળ</Button>{/* Increased height, width and font size */}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="p-6 border rounded-md w-full max-w-md"> {/* Increased padding */}
          <h2 className="text-2xl mb-3">શાળાની વિગતો દાખલ કરો</h2>{/* Increased font size and margin */}
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="schoolName" className="text-lg">શાળાનું નામ</Label>{/* Increased font size */}
            <Input
              id="schoolName"
              type="text"
              placeholder="શાળાનું નામ"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="text-lg"/* Increased font size */
            />
            {schoolNameError && <p className="text-red-500 text-sm">{schoolNameError}</p>}
          </div>
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="address" className="text-lg">સરનામુ</Label>{/* Increased font size */}
            <Input
              id="address"
              type="text"
              placeholder="સરનામુ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="text-lg"/* Increased font size */
            />
            {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
          </div>
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="phone" className="text-lg">ફોન</Label>{/* Increased font size */}
            <Input
              id="phone"
              type="text"
              placeholder="ફોન"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-lg"/* Increased font size */
            />
          </div>
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="registrationNumber" className="text-lg">રજી. નંબર</Label>{/* Increased font size */}
            <Input
              id="registrationNumber"
              type="text"
              placeholder="રજી. નંબર"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="text-lg"/* Increased font size */
            />
          </div>
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="trustName" className="text-lg">ટ્રસ્ટનું નામ</Label>{/* Increased font size */}
            <Input
              id="trustName"
              type="text"
              placeholder="ટ્રસ્ટનું નામ"
              value={trustName}
              onChange={(e) => setTrustName(e.target.value)}
              className="text-lg"/* Increased font size */
            />
             {trustNameError && <p className="text-red-500 text-sm">{trustNameError}</p>}
          </div>
          <div className="mb-5"> {/* Increased margin */}
            <Label htmlFor="trustAddress" className="text-lg">ટ્રસ્ટનું સરનામુ</Label>{/* Increased font size */}
            <Input
              id="trustAddress"
              type="text"
              placeholder="ટ્રસ્ટનું સરનામુ"
              value={trustAddress}
              onChange={(e) => setTrustAddress(e.target.value)}
              className="text-lg"/* Increased font size */
            />
             {trustAddressError && <p className="text-red-500 text-sm">{trustAddressError}</p>}
          </div>
          <div className="flex justify-between">
            <Button onClick={handleBack} className="h-12 w-32 text-lg">પાછળ</Button>{/* Increased height, width and font size */}
            <Button onClick={handleNext} className="h-12 w-32 text-lg">આગળ</Button>{/* Increased height, width and font size */}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="p-6 border rounded-md w-full max-w-md"> {/* Increased padding */}
          <h2 className="text-2xl mb-3">નાણાકીય વર્ષની પુષ્ટિ કરો</h2>{/* Increased font size and margin */}
          <p className="mb-5 text-lg">નાણાકીય વર્ષ {financialYear} રહેશે</p>{/* Increased margin and font size */}
          <div className="flex justify-between">
            <Button onClick={handleBack} className="h-12 w-32 text-lg">પાછળ</Button>{/* Increased height, width and font size */}
            <Button onClick={handleSetupComplete} className="h-12 w-32 text-lg">પૂર્ણ કરો</Button>{/* Increased height, width and font size */}
          </div>
          <Button variant="secondary" onClick={handleCancel} className="h-12 w-32 text-lg mt-4">રદ કરો</Button>{/* Increased height, width and font size */}
        </div>
      )}
    </div>
  );
}

export default SetupPage;
