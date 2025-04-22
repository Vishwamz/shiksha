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
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">સેટિંગ્સ</h1>

      {/* School Details Section */}
      <div className="border rounded-md p-4 mb-4">
        <h2 className="text-md font-semibold mb-2">શાળાની વિગતો</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>શાળાનું નામ</Label>
            <Input type="text" value={schoolName} disabled />
          </div>
          <div>
            <Label>સરનામુ</Label>
            <Input type="text" value={address} disabled />
          </div>
          <div>
            <Label>ફોન</Label>
            <Input type="text" value={phone} disabled />
          </div>
          <div>
            <Label>રજી. નંબર</Label>
            <Input type="text" value={registrationNumber} disabled />
          </div>
          <div>
            <Label>ટ્રસ્ટનું નામ</Label>
            <Input type="text" value={trustName} disabled />
          </div>
          <div>
            <Label>ટ્રસ્ટનું સરનામુ</Label>
            <Input type="text" value={trustAddress} disabled />
          </div>
        </div>
      </div>

      {/* Financial Year Section */}
      <div className="border rounded-md p-4 mb-4">
        <h2 className="text-md font-semibold mb-2">નાણાકીય વર્ષ</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>નવું નાણાકીય વર્ષ બનાવો</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>નવું નાણાકીય વર્ષ બનાવો</DialogTitle>
              <DialogDescription>
                શું તમે આગલું નાણાકીય વર્ષ બનાવવા માંગો છો?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            </div>
            <Button onClick={handleCreateNewFinancialYear}>બનાવો</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Details Section */}
      <div className="border rounded-md p-4 mb-4">
        <h2 className="text-md font-semibold mb-2">વપરાશકર્તાની વિગતો</h2>
        <div>
          <Label>યુઝરનેમ</Label>
          <Input type="text" value="admin" disabled />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>પાસવર્ડ બદલો</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>પાસવર્ડ બદલો</DialogTitle>
              <DialogDescription>
                તમારો પાસવર્ડ બદલવા માટે, કૃપા કરીને નીચેના ફીલ્ડ્સ ભરો.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentPassword" className="text-right">
                  હાલનો પાસવર્ડ
                </Label>
                <Input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  નવો પાસવર્ડ
                </Label>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right">
                  પાસવર્ડની પુષ્ટિ કરો
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
            <Button onClick={handleChangePassword}>પાસવર્ડ બદલો</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default SettingsPage;
