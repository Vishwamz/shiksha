
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function SettingsPage() {
  const { toast } = useToast();

  // School Details State (Dummy Data - Replace with actual data fetching)
  const [schoolName, setSchoolName] = useState("Example School");
  const [address, setAddress] = useState("123 Main St, City");
  const [phone, setPhone] = useState("+91-1234567890");
  const [registrationNumber, setRegistrationNumber] = useState("ABC12345");
  const [trustName, setTrustName] = useState("Example Trust");
  const [trustAddress, setTrustAddress] = useState("456 Trust Rd, City");

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    if (!/^\d{4}$/.test(newPassword)) {
      setPasswordError("New Password 4 digit");
      return;
    }

    // Implement actual password change logic here (e.g., API call)
    toast({
      title: "Password changed!",
      description: "Your password has been updated successfully.",
    });
  };

  const handleCreateNewFinancialYear = () => {
    toast({
      title: "New financial year created!",
      description: "Successfully created a new financial year.",
    });
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-6">સેટિંગ્સ</h1>

      {/* School Details Section */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
        <h2 className="text-xl font-semibold mb-3">શાળાની વિગતો</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-base">શાળાનું નામ</Label>
            <Input type="text" value={schoolName} disabled className="text-sm"/>
          </div>
          <div>
            <Label className="text-base">સરનામુ</Label>
            <Input type="text" value={address} disabled className="text-sm"/>
          </div>
          <div>
            <Label className="text-base">ફોન</Label>
            <Input type="text" value={phone} disabled className="text-sm"/>
          </div>
          <div>
            <Label className="text-base">રજી. નંબર</Label>
            <Input type="text" value={registrationNumber} disabled className="text-sm"/>
          </div>
          <div>
            <Label className="text-base">ટ્રસ્ટનું નામ</Label>
            <Input type="text" value={trustName} disabled className="text-sm"/>
          </div>
          <div>
            <Label className="text-base">ટ્રસ્ટનું સરનામુ</Label>
            <Input type="text" value={trustAddress} disabled className="text-sm"/>
          </div>
        </div>
      </div>

      {/* Financial Year Section */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
        <h2 className="text-xl font-semibold mb-3">નાણાકીય વર્ષ</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-10">નવું નાણાકીય વર્ષ બનાવો</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-lg">નવું નાણાકીય વર્ષ બનાવો</DialogTitle>
              <DialogDescription className="text-sm">
                શું તમે આગલું નાણાકીય વર્ષ બનાવવા માંગો છો?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3">
            </div>
            <Button onClick={handleCreateNewFinancialYear} className="h-10">બનાવો</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Details Section */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
        <h2 className="text-xl font-semibold mb-3">વપરાશકર્તાની વિગતો</h2>
        <div>
          <Label className="text-base">યુઝરનેમ</Label>
          <Input type="text" value="admin" disabled className="text-sm"/>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-10 mt-3">પાસવર્ડ બદલો</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-lg">પાસવર્ડ બદલો</DialogTitle>
              <DialogDescription className="text-sm">
                તમારો પાસવર્ડ બદલવા માટે, કૃપા કરીને નીચેના ફીલ્ડ્સ ભરો.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-3">
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="currentPassword" className="text-right text-base">
                  હાલનો પાસવર્ડ
                </Label>
                <Input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="col-span-3 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="newPassword" className="text-right text-base">
                  નવો પાસવર્ડ
                </Label>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3 text-sm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="confirmPassword" className="text-right text-base">
                  પાસવર્ડની પુષ્ટિ કરો
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3 text-sm"
                />
              </div>
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
            <Button onClick={handleChangePassword} className="h-10">પાસવર્ડ બદલો</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default SettingsPage;
    