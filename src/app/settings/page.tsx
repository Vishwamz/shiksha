{"use client";

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
    <div className="p-6"> {/* Increased padding */}
      <h1 className="text-3xl font-bold mb-6">સેટિંગ્સ</h1>{/* Increased font size and margin */}

      {/* School Details Section */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-4">શાળાની વિગતો</h2>{/* Increased font size and margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> {/* Increased gap */}
          <div>
            <Label className="text-lg">શાળાનું નામ</Label>{/* Increased font size */}
            <Input type="text" value={schoolName} disabled className="text-lg" />{/* Increased font size */}
          </div>
          <div>
            <Label className="text-lg">સરનામુ</Label>{/* Increased font size */}
            <Input type="text" value={address} disabled className="text-lg" />{/* Increased font size */}
          </div>
          <div>
            <Label className="text-lg">ફોન</Label>{/* Increased font size */}
            <Input type="text" value={phone} disabled className="text-lg" />{/* Increased font size */}
          </div>
          <div>
            <Label className="text-lg">રજી. નંબર</Label>{/* Increased font size */}
            <Input type="text" value={registrationNumber} disabled className="text-lg" />{/* Increased font size */}
          </div>
          <div>
            <Label className="text-lg">ટ્રસ્ટનું નામ</Label>{/* Increased font size */}
            <Input type="text" value={trustName} disabled className="text-lg" />{/* Increased font size */}
          </div>
          <div>
            <Label className="text-lg">ટ્રસ્ટનું સરનામુ</Label>{/* Increased font size */}
            <Input type="text" value={trustAddress} disabled className="text-lg" />{/* Increased font size */}
          </div>
        </div>
      </div>

      {/* Financial Year Section */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-4">નાણાકીય વર્ષ</h2>{/* Increased font size and margin */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-12 text-lg">નવું નાણાકીય વર્ષ બનાવો</Button>{/* Increased height and font size */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]"> {/* Increased width */}
            <DialogHeader>
              <DialogTitle className="text-2xl">નવું નાણાકીય વર્ષ બનાવો</DialogTitle>{/* Increased font size */}
              <DialogDescription className="text-lg">
                શું તમે આગલું નાણાકીય વર્ષ બનાવવા માંગો છો?
              </DialogDescription>{/* Increased font size */}
            </DialogHeader>
            <div className="grid gap-5 py-5"> {/* Increased gap and padding */}
            </div>
            <Button onClick={handleCreateNewFinancialYear} className="h-12 text-lg">બનાવો</Button>{/* Increased height and font size */}
          </DialogContent>
        </Dialog>
      </div>

      {/* User Details Section */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-4">વપરાશકર્તાની વિગતો</h2>{/* Increased font size and margin */}
        <div>
          <Label className="text-lg">યુઝરનેમ</Label>{/* Increased font size */}
          <Input type="text" value="admin" disabled className="text-lg" />{/* Increased font size */}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-12 text-lg mt-4">પાસવર્ડ બદલો</Button>{/* Increased height, font size, and margin */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]"> {/* Increased width */}
            <DialogHeader>
              <DialogTitle className="text-2xl">પાસવર્ડ બદલો</DialogTitle>{/* Increased font size */}
              <DialogDescription className="text-lg">
                તમારો પાસવર્ડ બદલવા માટે, કૃપા કરીને નીચેના ફીલ્ડ્સ ભરો.
              </DialogDescription>{/* Increased font size */}
            </DialogHeader>
            <div className="grid gap-5 py-5"> {/* Increased gap and padding */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentPassword" className="text-right text-lg">
                  હાલનો પાસવર્ડ
                </Label>{/* Increased font size */}
                <Input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="col-span-3 text-lg"/* Increased font size */
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right text-lg">
                  નવો પાસવર્ડ
                </Label>{/* Increased font size */}
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3 text-lg"/* Increased font size */
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right text-lg">
                  પાસવર્ડની પુષ્ટિ કરો
                </Label>{/* Increased font size */}
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3 text-lg"/* Increased font size */
                />
              </div>
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
            <Button onClick={handleChangePassword} className="h-12 text-lg">પાસવર્ડ બદલો</Button>{/* Increased height and font size */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default SettingsPage;
