"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Icons } from "@/components/icons";

function AccountPage() {
  const { toast } = useToast();

  // State variables for Account Group
  const [accountGroups, setAccountGroups] = useState([
    { id: 1, code: 1, name: "Cash-in-hand", type: "Primary Group" },
    { id: 2, code: 2, name: "Bank A/c", type: "Primary Group" },
    { id: 3, code: 3, name: "Capital A/c", type: "Primary Group" },
    { id: 4, code: 4, name: "Expenses Direct", type: "Derived Group" },
  ]);
  const [selectedAccountGroup, setSelectedAccountGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [isGroupFormEditable, setIsGroupFormEditable] = useState(false);
  const [latestGroupCode, setLatestGroupCode] = useState(accountGroups.length > 0 ? Math.max(...accountGroups.map(g => g.code)) : 0); // Initialize with the highest existing code

  // State variables for Account Master
  const [accounts, setAccounts] = useState([
    { id: 1, code: 1, group: "Cash-in-hand", name: "Account name 1", type: "રોકડ ખાતુ", effect: "નફા નુકશાન પત્રકમાં", openingBalance: 1000, address: "Address 1", phone: "+91-1234567890" },
    { id: 2, code: 2, group: "Bank A/c", name: "Account name 2", type: "બેંક ખાતુ", effect: "સરવૈયામાં", openingBalance: 2000, address: "Address 2", phone: "+91-9876543210" },
    { id: 3, code: 3, group: "Capital A/c", name: "Account name 3", type: "અન્ય ખાતુ", effect: "નફા નુકશાન પત્રકમાં", openingBalance: 3000, address: "Address 3", phone: "+91-1122334455" },
    { id: 4, code: 4, group: "Expenses Direct", name: "Account name 4", type: "વ્યક્તિ/વેપારી ખાતુ", effect: "સરવૈયામાં", openingBalance: 4000, address: "Address 4", phone: "+91-6677889900" },
  ]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountGroup, setAccountGroup] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountEffect, setAccountEffect] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isAccountFormEditable, setIsAccountFormEditable] = useState(false);
    const [latestAccountCode, setLatestAccountCode] = useState(accounts.length > 0 ? Math.max(...accounts.map(a => a.code)) : 0);

  // Validation error state
  const [groupNameError, setGroupNameError] = useState("");
  const [accountNameError, setAccountNameError] = useState("");

  // Derived state for new group code
  const newGroupCode = latestGroupCode + 1;

  // Derived state for new account code
  const newAccountCode = latestAccountCode + 1;

  // Account Group Handlers
  const handleAddGroup = () => {
    setIsGroupFormEditable(true);
    setGroupName("");
    setGroupType("");
    setSelectedAccountGroup(null);
  };

  const handleEditGroup = () => {
    if (selectedAccountGroup) {
      setIsGroupFormEditable(true);
    } else {
      toast({
        title: "સૂચના",
        description: "સંપાદિત કરવા માટે પહેલાં એકાઉન્ટ જૂથ પસંદ કરો.",
      });
    }
  };

  const handleSaveGroup = () => {
    // Validate Group Name
    if (!groupName) {
      setGroupNameError("જૂથનું નામ જરૂરી છે.");
      return;
    }
    if (accountGroups.some((group) => group.name === groupName && group !== selectedAccountGroup)) {
      setGroupNameError("આ જૂથનું નામ પહેલેથી જ અસ્તિત્વમાં છે.");
      return;
    }

    if (isGroupFormEditable) {
      if (selectedAccountGroup) {
        // Editing existing group
        const updatedGroups = accountGroups.map((group) =>
          group.id === selectedAccountGroup.id ? { ...group, name: groupName, type: groupType } : group
        );
        setAccountGroups(updatedGroups);
        toast({
          title: "સફળ",
          description: "એકાઉન્ટ જૂથ સફળતાપૂર્વક અપડેટ થયું.",
        });
      } else {
        // Adding new group
        const newGroup = {
          id: newGroupCode,
          code: newGroupCode,
          name: groupName,
          type: groupType,
        };
        setAccountGroups([...accountGroups, newGroup]);
        setLatestGroupCode(newGroupCode); // Update latest code
        toast({
          title: "સફળ",
          description: "નવું એકાઉન્ટ જૂથ સફળતાપૂર્વક ઉમેરાયું.",
        });
      }
      setIsGroupFormEditable(false);
      setSelectedAccountGroup(null);
    }
  };

  const handleCancelGroup = () => {
    setIsGroupFormEditable(false);
    setGroupNameError("");
    setSelectedAccountGroup(null);
    if (selectedAccountGroup) {
      setGroupName(selectedAccountGroup.name);
      setGroupType(selectedAccountGroup.type);
    } else {
      setGroupName("");
      setGroupType("");
    }
  };

  const handleDeleteGroup = (groupId: number) => {
    // Check if any accounts are linked to this group
    const linkedAccounts = accounts.filter((account) => account.group === selectedAccountGroup?.name);
    if (linkedAccounts.length > 0) {
      toast({
        variant: "destructive",
        title: "સૂચના",
        description: "આ એકાઉન્ટ જૂથને ડિલીટ કરી શકાતું નથી કેમ કે એકાઉન્ટ્સ જોડાયેલા છે.",
      });
      return false;
    } else {
      setAccountGroups(accountGroups.filter((group) => group.id !== groupId));
      setSelectedAccountGroup(null);
      toast({
        title: "સફળ",
        description: "એકાઉન્ટ જૂથ સફળતાપૂર્વક ડિલીટ થયું.",
      });
      return true;
    }
  };

  // Account Master Handlers
  const handleAddAccount = () => {
    setIsAccountFormEditable(true);
    setAccountGroup("");
    setAccountName("");
    setAccountType("");
    setAccountEffect("");
    setOpeningBalance("");
    setAddress("");
    setPhone("");
    setSelectedAccount(null);
  };

  const handleEditAccount = () => {
    if (selectedAccount) {
      setIsAccountFormEditable(true);
    } else {
      toast({
        title: "સૂચના",
        description: "સંપાદિત કરવા માટે પહેલાં એકાઉન્ટ પસંદ કરો.",
      });
    }
  };

  const handleSaveAccount = () => {
    if (!accountName) {
      setAccountNameError("ખાતાનું નામ જરૂરી છે.");
      return;
    }
    if (accounts.some((account) => account.name === accountName && account !== selectedAccount)) {
      setAccountNameError("આ ખાતાનું નામ પહેલેથી જ અસ્તિત્વમાં છે.");
      return;
    }

    if (isAccountFormEditable) {
      if (selectedAccount) {
        // Editing existing account
        const updatedAccounts = accounts.map((account) =>
          account.id === selectedAccount.id
            ? {
                ...account,
                group: accountGroup,
                name: accountName,
                type: accountType,
                effect: accountEffect,
                openingBalance: openingBalance,
                address: address,
                phone: phone,
              }
            : account
        );
        setAccounts(updatedAccounts);
                setLatestAccountCode(latestAccountCode)
        toast({
          title: "સફળ",
          description: "એકાઉન્ટ સફળતાપૂર્વક અપડેટ થયું.",
        });
      } else {
        // Adding new account
        const newAccount = {
          id: newAccountCode,
          code: newAccountCode,
          group: accountGroup,
          name: accountName,
          type: accountType,
          effect: accountEffect,
          openingBalance: openingBalance,
          address: address,
          phone: phone,
        };
        setAccounts([...accounts, newAccount]);
        setLatestAccountCode(newAccountCode);
        toast({
          title: "સફળ",
          description: "નવું એકાઉન્ટ સફળતાપૂર્વક ઉમેરાયું.",
        });
      }
      setIsAccountFormEditable(false);
      setSelectedAccount(null);
    }
  };

  const handleCancelAccount = () => {
    setIsAccountFormEditable(false);
    setAccountNameError("");
    setSelectedAccount(null);
    if (selectedAccount) {
      setAccountGroup(selectedAccount.group);
      setAccountName(selectedAccount.name);
      setAccountType(selectedAccount.type);
      setAccountEffect(selectedAccount.effect);
      setOpeningBalance(selectedAccount.openingBalance);
      setAddress(selectedAccount.address);
      setPhone(selectedAccount.phone);
    } else {
      setAccountGroup("");
      setAccountName("");
      setAccountType("");
      setAccountEffect("");
      setOpeningBalance("");
      setAddress("");
      setPhone("");
    }
  };

  const handleDeleteAccount = (accountId: number) => {
    // Check if any vouchers are linked to this account
    // This is a placeholder for actual voucher link checking logic
    const isVoucherLinked = false; // Replace with actual check

    if (isVoucherLinked) {
      toast({
        variant: "destructive",
        title: "સૂચના",
        description: "આ એકાઉન્ટને ડિલીટ કરી શકાતું નથી કેમ કે વાઉચર્સ જોડાયેલા છે.",
      });
      return false;
    } else {
      setAccounts(accounts.filter((account) => account.id !== accountId));
      setSelectedAccount(null);
      toast({
        title: "સફળ",
        description: "એકાઉન્ટ સફળતાપૂર્વક ડિલીટ થયું.",
      });
      return true;
    }
  };

  useEffect(() => {
    if (selectedAccountGroup) {
      setGroupName(selectedAccountGroup.name);
      setGroupType(selectedAccountGroup.type);
    }
  }, [selectedAccountGroup]);

  useEffect(() => {
    if (selectedAccount) {
      setAccountGroup(selectedAccount.group);
      setAccountName(selectedAccount.name);
      setAccountType(selectedAccount.type);
      setAccountEffect(selectedAccount.effect);
      setOpeningBalance(selectedAccount.openingBalance);
      setAddress(selectedAccount.address);
      setPhone(selectedAccount.phone);
    }
  }, [selectedAccount]);

    useEffect(() => {
        setLatestGroupCode(accountGroups.length > 0 ? Math.max(...accountGroups.map(g => g.code)) : 0);
    }, [accountGroups]);

    useEffect(() => {
        setLatestAccountCode(accounts.length > 0 ? Math.max(...accounts.map(a => a.code)) : 0);
    }, [accounts]);

  return (
    <div className="flex flex-col min-h-screen p-4"> {/* Added padding to the main container */}
      {/* Account Group Section */}
      <div className="border rounded-md mb-4 p-4 bg-card"> {/* Increased padding and margin */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">એકાઉન્ટ જૂથ</h2>
          <Button onClick={handleAddGroup} disabled={isGroupFormEditable}>નવું ઉમેરો</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Responsive grid layout with gap */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="groupCode">જુથનો કોડ</Label>
            <Input id="groupCode" type="text" value={newGroupCode} disabled />

            <Label htmlFor="groupName">જુથનું નામ</Label>
            <Input
              id="groupName"
              type="text"
              placeholder="જુથનું નામ"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={!isGroupFormEditable}
            />
            {groupNameError && <p className="text-red-500 text-sm">{groupNameError}</p>}

            <Label htmlFor="groupType">જુથનો પ્રકાર</Label>
            <Select disabled={!isGroupFormEditable} onValueChange={(value) => setGroupType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="જૂથનો પ્રકાર પસંદ કરો" defaultValue={groupType}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary Group">Primary Group</SelectItem>
                <SelectItem value="Derived Group">Derived Group</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-start gap-2 mt-4">
              <Button
                onClick={handleSaveGroup}
                disabled={!isGroupFormEditable}
              >
                સેવ કરો
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancelGroup}
                disabled={!isGroupFormEditable}
              >
                રદ કરો
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isGroupFormEditable || !selectedAccountGroup}>
                    કાઢી નાખો
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>શું તમે ખરેખર કાઢી નાખવા માંગો છો?</AlertDialogTitle>
                    <AlertDialogDescription>
                      આ ક્રિયા પૂર્વવત્ કરી શકાતી નથી. શું તમે ખાતરી કરો છો કે તમે આ એકાઉન્ટ જૂથ કાઢી નાખવા માંગો છો?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>રદ કરો</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      if (selectedAccountGroup) {
                        handleDeleteGroup(selectedAccountGroup.id)
                      }
                    }}>કાઢી નાખો</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                onClick={handleEditGroup}
                disabled={isGroupFormEditable || !selectedAccountGroup}
              >
                એડિટ કરો
              </Button>
            </div>
          </div>
          <div>
            <ScrollArea className="h-[220px] w-full rounded-md border mt-2">
              <div className="p-3">
                {accountGroups.map((group) => (
                  <div
                    key={group.id}
                    className={cn(
                      "cursor-pointer rounded-md p-2 hover:bg-secondary",
                      selectedAccountGroup?.id === group.id ? "bg-secondary" : ""
                    )}
                    onClick={() => setSelectedAccountGroup(group)}
                  >
                    {group.name}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Account Master Section */}
      <div className="border rounded-md mb-4 p-4 bg-card"> {/* Increased padding and margin */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">એકાઉન્ટ માસ્ટર</h2>
          <Button onClick={handleAddAccount} disabled={isAccountFormEditable}>નવું ઉમેરો</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Responsive grid layout with gap */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="accountCode">ખાતાનો કોડ</Label>
            <Input id="accountCode" type="text" value={newAccountCode} disabled />

            <Label htmlFor="accountGroup">જુથનું નામ</Label>
            <Select disabled={!isAccountFormEditable} onValueChange={(value) => setAccountGroup(value)}>
              <SelectTrigger>
                <SelectValue placeholder="જૂથનું નામ પસંદ કરો" defaultValue={accountGroup} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="max-h-64">
                  {accountGroups.map((group) => (
                    <SelectItem key={group.id} value={group.name}>
                      {group.name}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>

            <Label htmlFor="accountName">ખાતાનું નામ</Label>
            <Input
              id="accountName"
              type="text"
              placeholder="ખાતાનું નામ"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={!isAccountFormEditable}
            />
            {accountNameError && <p className="text-red-500 text-sm">{accountNameError}</p>}

            <Label htmlFor="accountType">ખાતાનો પ્રકાર</Label>
            <Select disabled={!isAccountFormEditable} onValueChange={(value) => setAccountType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="ખાતાનો પ્રકાર પસંદ કરો" defaultValue={accountType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="વ્યક્તિ/વેપારી ખાતુ">વ્યક્તિ/વેપારી ખાતુ</SelectItem>
                <SelectItem value="બેંક ખાતુ">બેંક ખાતુ</SelectItem>
                <SelectItem value="રોકડ ખાતુ">રોકડ ખાતુ</SelectItem>
                <SelectItem value="અન્ય ખાતુ">અન્ય ખાતુ</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="accountEffect">ખાતાની અસર</Label>
            <Select disabled={!isAccountFormEditable} onValueChange={(value) => setAccountEffect(value)}>
              <SelectTrigger>
                <SelectValue placeholder="ખાતાની અસર પસંદ કરો" defaultValue={accountEffect} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="નફા નુકશાન પત્રકમાં">નફા નુકશાન પત્રકમાં</SelectItem>
                <SelectItem value="સરવૈયામાં">સરવૈયામાં</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="openingBalance">ખુલતી સિલક</Label>
            <Input
              id="openingBalance"
              type="number"
              placeholder="ખુલતી સિલક"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              disabled={!isAccountFormEditable}
            />

            <Label htmlFor="address">સરનામુ</Label>
            <Input
              id="address"
              type="text"
              placeholder="સરનામુ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isAccountFormEditable}
            />

            <Label htmlFor="phone">ફોન</Label>
            <Input
              id="phone"
              type="text"
              placeholder="ફોન"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isAccountFormEditable}
            />

            <div className="flex justify-start gap-2 mt-4">
              <Button onClick={handleSaveAccount} disabled={!isAccountFormEditable}>
                સેવ કરો
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancelAccount}
                disabled={!isAccountFormEditable}
              >
                રદ કરો
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isAccountFormEditable || !selectedAccount}>
                    કાઢી નાખો
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>શું તમે ખરેખર કાઢી નાખવા માંગો છો?</AlertDialogTitle>
                    <AlertDialogDescription>
                      આ ક્રિયા પૂર્વવત્ કરી શકાતી નથી. શું તમે ખાતરી કરો છો કે તમે આ એકાઉન્ટ કાઢી નાખવા માંગો છો?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>રદ કરો</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      if (selectedAccount) {
                        handleDeleteAccount(selectedAccount.id)
                      }
                    }}>કાઢી નાખો</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                onClick={handleEditAccount}
                disabled={isAccountFormEditable || !selectedAccount}
              >
                એડિટ કરો
              </Button>
            </div>
          </div>
          <div>
            <ScrollArea className="h-[380px] w-full rounded-md border mt-2 mb-4">
              <div className="p-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={cn(
                      "cursor-pointer rounded-md p-2 hover:bg-secondary",
                      selectedAccount?.id === account.id ? "bg-secondary" : ""
                    )}
                    onClick={() => setSelectedAccount(account)}
                  >
                    {account.name}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
