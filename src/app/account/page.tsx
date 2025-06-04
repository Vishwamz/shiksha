"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllAccountGroups, addAccountGroup, updateAccountGroup, deleteAccountGroup, getNextAccountGroupCode,
    getAllAccounts, addAccount, updateAccount, deleteAccount, getNextAccountCode
} from '@/lib/db'; // Adjust path
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
  const queryClient = useQueryClient();

  // For Account Groups
  const { data: accountGroups = [], isLoading: isLoadingGroups, error: errorGroups } = useQuery({
      queryKey: ['accountGroups'],
      queryFn: getAllAccountGroups
  });

  const { data: nextGroupCodeData } = useQuery({
      queryKey: ['nextAccountGroupCode'],
      queryFn: getNextAccountGroupCode,
      initialData: 1 // Or fetch initially then keep in component state
  });

  const [selectedAccountGroup, setSelectedAccountGroup] = useState<any>(null); // Consider defining a type for AccountGroup
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [isGroupFormEditable, setIsGroupFormEditable] = useState(false);

  const newGroupCode = selectedAccountGroup ? selectedAccountGroup.code : (nextGroupCodeData || (accountGroups.length > 0 ? Math.max(0, ...accountGroups.map(g => g.code)) + 1 : 1)) ;

  const [latestGroupCode, setLatestGroupCode] = useState(0);
   useEffect(() => {
        if (accountGroups && accountGroups.length > 0) {
            setLatestGroupCode(Math.max(...accountGroups.map(g => g.code), 0));
        } else if (nextGroupCodeData) {
            setLatestGroupCode(nextGroupCodeData -1);
        }
   }, [accountGroups, nextGroupCodeData]);


  const addGroupMutation = useMutation({
      mutationFn: addAccountGroup,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['accountGroups'] });
          queryClient.invalidateQueries({ queryKey: ['nextAccountGroupCode'] });
          toast({ title: "સફળ", description: "નવું એકાઉન્ટ જૂથ સફળતાપૂર્વક ઉમેરાયું." });
          setIsGroupFormEditable(false);
          setGroupName("");
          setGroupType("");
          setSelectedAccountGroup(null);
      },
      onError: (error: any) => {
          toast({ variant: "destructive", title: "ભૂલ", description: error.message });
      }
  });

  const updateGroupMutation = useMutation({
      mutationFn: (variables: { id: number; data: { name: string; type: string } }) => updateAccountGroup(variables.id, variables.data),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['accountGroups'] });
          toast({ title: "સફળ", description: "એકાઉન્ટ જૂથ સફળતાપૂર્વક અપડેટ થયું." });
          setIsGroupFormEditable(false);
          setSelectedAccountGroup(null);
          setGroupName("");
          setGroupType("");
      },
      onError: (error: any) => {
          toast({ variant: "destructive", title: "ભૂલ", description: error.message });
      }
  });

  const deleteGroupMutation = useMutation({
       mutationFn: deleteAccountGroup,
       onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ['accountGroups'] });
           queryClient.invalidateQueries({ queryKey: ['accounts'] }); // In case group name is used in accounts list
           queryClient.invalidateQueries({ queryKey: ['nextAccountGroupCode'] });
           toast({ title: "સફળ", description: "એકાઉન્ટ જૂથ સફળતાપૂર્વક ડિલીટ થયું." });
           setSelectedAccountGroup(null);
           setGroupName("");
           setGroupType("");
       },
       onError: (error: any) => {
           toast({ variant: "destructive", title: "ભૂલ", description: error.message });
       }
  });

  // --- Account Master State & Mutations ---
  const { data: accounts = [], isLoading: isLoadingAccounts, error: errorAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccounts
  });

  const { data: nextAccountCodeData } = useQuery({
      queryKey: ['nextAccountCode'],
      queryFn: getNextAccountCode,
      initialData: 1
  });

  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [accountGroup, setAccountGroup] = useState(""); // Stores selected group NAME for the account form
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountEffect, setAccountEffect] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isAccountFormEditable, setIsAccountFormEditable] = useState(false);

  const newAccountCode = selectedAccount ? selectedAccount.code : (nextAccountCodeData || (accounts.length > 0 ? Math.max(0, ...accounts.map((a:any) => a.code)) + 1 : 1));

  const addAccountMutation = useMutation({
      mutationFn: addAccount,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
          queryClient.invalidateQueries({ queryKey: ['nextAccountCode'] });
          toast({ title: "સફળ", description: "નવું એકાઉન્ટ સફળતાપૂર્વક ઉમેરાયું." });
          resetAccountForm();
      },
      onError: (error: any) => {
          toast({ variant: "destructive", title: "ભૂલ", description: error.message });
      }
  });

  const updateAccountMutation = useMutation({
      mutationFn: (variables: { id: number; data: any }) => updateAccount(variables.id, variables.data),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
          toast({ title: "સફળ", description: "એકાઉન્ટ સફળતાપૂર્વક અપડેટ થયું." });
          resetAccountForm();
      },
      onError: (error: any) => {
          toast({ variant: "destructive", title: "ભૂલ", description: error.message });
      }
  });

  const deleteAccountMutation = useMutation({
      mutationFn: deleteAccount,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
          queryClient.invalidateQueries({ queryKey: ['nextAccountCode'] });
          toast({ title: "સફળ", description: "એકાઉન્ટ સફળતાપૂર્વક ડિલીટ થયું." });
          resetAccountForm();
      },
      onError: (error: any) => {
          toast({ variant: "destructive", title: "ભૂલ", description: error.message });
      }
  });

  // Validation error state
  const [groupNameError, setGroupNameError] = useState("");
  const [accountNameError, setAccountNameError] = useState("");

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
    if (!groupName) {
      setGroupNameError("જૂથનું નામ જરૂરી છે.");
      return;
    }
    setGroupNameError(""); // Clear error if validation passes

    // Check for duplicate name client-side (optional, as DB has UNIQUE constraint)
    if (accountGroups.some((group: any) => group.name === groupName && group.id !== selectedAccountGroup?.id)) {
        setGroupNameError("આ જૂથનું નામ પહેલેથી જ અસ્તિત્વમાં છે.");
        return;
    }

    if (selectedAccountGroup) {
      updateGroupMutation.mutate({ id: selectedAccountGroup.id, data: { name: groupName, type: groupType } });
    } else {
      addGroupMutation.mutate({ name: groupName, type: groupType, code: newGroupCode });
    }
  };

  const handleCancelGroup = () => {
    setIsGroupFormEditable(false);
    setGroupNameError("");
    if (selectedAccountGroup) {
        // If editing, revert to selected group's data
        setGroupName(selectedAccountGroup.name);
        setGroupType(selectedAccountGroup.type);
    } else {
        // If adding, clear fields
        setGroupName("");
        setGroupType("");
    }
    setSelectedAccountGroup(null); // Deselect group
  };

  const handleDeleteGroup = (groupId: number) => {
    deleteGroupMutation.mutate(groupId);
  };

  // --- Account Master Helper Functions ---
  const resetAccountForm = () => {
      setIsAccountFormEditable(false);
      setSelectedAccount(null);
      setAccountName("");
      setAccountGroup(""); // This should be the group NAME
      setAccountType("");
      setAccountEffect("");
      setOpeningBalance("");
      setAddress("");
      setPhone("");
      setAccountNameError("");
  };

  // --- Account Master Handlers ---
  const handleAddAccount = () => {
    resetAccountForm();
    setIsAccountFormEditable(true);
    // Optional: Pre-select first account group if available
    // if (accountGroups && accountGroups.length > 0) {
    //    setAccountGroup(accountGroups[0].name);
    // }
  };

  const handleEditAccount = () => {
    if (selectedAccount) {
      setIsAccountFormEditable(true);
      // Form fields are populated by useEffect watching selectedAccount
    } else {
      toast({
        title: "સૂચના",
        description: "સંપાદિત કરવા માટે પહેલાં એકાઉન્ટ પસંદ કરો.",
      });
    }
  };

  const handleSaveAccount = () => {
    if (!accountName.trim()) {
      setAccountNameError("ખાતાનું નામ જરૂરી છે.");
      return;
    }
    if (!accountGroup) { // accountGroup stores the group NAME
        toast({ variant: "destructive", title: "ભૂલ", description: "કૃપા કરીને એકાઉન્ટ જૂથ પસંદ કરો."});
        return;
    }
    setAccountNameError("");

    // Client-side check for duplicate account name (optional, as DB has UNIQUE constraint)
    if (accounts.some((acc: any) => acc.name === accountName.trim() && acc.id !== selectedAccount?.id)) {
        setAccountNameError("આ ખાતાનું નામ પહેલેથી જ અસ્તિત્વમાં છે.");
        return;
    }

    const accountData = {
        group_name: accountGroup, // This is the group NAME
        name: accountName.trim(),
        type: accountType,
        effect: accountEffect,
        opening_balance: parseFloat(openingBalance) || 0,
        address: address.trim(),
        phone: phone.trim(),
        code: selectedAccount ? selectedAccount.code : newAccountCode
    };

    if (selectedAccount) {
      updateAccountMutation.mutate({ id: selectedAccount.id, data: accountData });
    } else {
      addAccountMutation.mutate(accountData);
    }
  };

  const handleCancelAccount = () => {
    resetAccountForm();
  };

  const handleDeleteAccount = (accountId: number) => {
    deleteAccountMutation.mutate(accountId);
  };

  // --- useEffect hooks ---
  useEffect(() => {
    if (selectedAccountGroup) {
      setGroupName(selectedAccountGroup.name);
      setGroupType(selectedAccountGroup.type);
    } else {
        // When deselecting or adding new, clear form
        if (!isGroupFormEditable) { // only clear if not in edit mode for a new item
            setGroupName("");
            setGroupType("");
        }
    }
  }, [selectedAccountGroup, isGroupFormEditable]);

  useEffect(() => {
    if (selectedAccount && isAccountFormEditable) {
      setAccountGroup(selectedAccount.group_name); // Populate with group_name
      setAccountName(selectedAccount.name);
      setAccountType(selectedAccount.type || "");
      setAccountEffect(selectedAccount.effect || "");
      setOpeningBalance(selectedAccount.opening_balance?.toString() || "0");
      setAddress(selectedAccount.address || "");
      setPhone(selectedAccount.phone || "");
    } else if (!selectedAccount && !isAccountFormEditable) {
        // This case is mostly handled by resetAccountForm in cancel/success of mutations
        // but good for explicit deselection if that's a feature.
         resetAccountForm();
    }
  }, [selectedAccount, isAccountFormEditable]);


    // Commented out, as newGroupCode is now derived from nextGroupCodeData or accountGroups
    // useEffect(() => {
    //     setLatestGroupCode(accountGroups.length > 0 ? Math.max(...accountGroups.map(g => g.code)) : 0);
    // }, [accountGroups]);

    // Commented out, as newAccountCode is derived from nextAccountCodeData or accounts
    // useEffect(() => {
    //     setLatestAccountCode(accounts.length > 0 ? Math.max(...accounts.map((a:any) => a.code)) : 0);
    // }, [accounts]);


  if (isLoadingGroups || isLoadingAccounts) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Icons.spinner className="h-12 w-12 animate-spin" />
            <p className="ml-2">લોડિંગ...</p>
        </div>
    );
  }

  if (errorGroups) return <p>Error loading account groups: {(errorGroups as Error).message}</p>;
  if (errorAccounts) return <p>Error loading accounts: {(errorAccounts as Error).message}</p>;

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
            <Input id="groupCode" type="text" value={isGroupFormEditable && !selectedAccountGroup ? newGroupCode : selectedAccountGroup?.code || newGroupCode} disabled />

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
            <Select
                value={groupType}
                onValueChange={(value) => setGroupType(value)}
                disabled={!isGroupFormEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="જૂથનો પ્રકાર પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary Group">Primary Group</SelectItem>
                <SelectItem value="Derived Group">Derived Group</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-start gap-2 mt-4">
              <Button
                onClick={handleSaveGroup}
                disabled={!isGroupFormEditable || addGroupMutation.isPending || updateGroupMutation.isPending}
              >
                {addGroupMutation.isPending || updateGroupMutation.isPending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                  <Button variant="destructive" disabled={isGroupFormEditable || !selectedAccountGroup || deleteGroupMutation.isPending}>
                    {deleteGroupMutation.isPending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                {accountGroups && accountGroups.map((group: any) => ( // Added type for group
                  <div
                    key={group.id}
                    className={cn(
                      "cursor-pointer rounded-md p-2 hover:bg-secondary",
                      selectedAccountGroup?.id === group.id ? "bg-secondary" : ""
                    )}
                    onClick={() => {
                        if (!isGroupFormEditable) {
                            setSelectedAccountGroup(group);
                        }
                    }}
                  >
                    {group.code} - {group.name} ({group.type})
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Account Master Section */}
      <div className="border rounded-md mb-4 p-4 bg-card">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">એકાઉન્ટ માસ્ટર</h2>
          <Button onClick={handleAddAccount} disabled={isAccountFormEditable || addAccountMutation.isPending || updateAccountMutation.isPending}>નવું ઉમેરો</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="accountCode">ખાતાનો કોડ</Label>
            <Input id="accountCode" type="text" value={isAccountFormEditable && !selectedAccount ? newAccountCode : selectedAccount?.code || newAccountCode} disabled />

            <Label htmlFor="accountGroup">જુથનું નામ</Label>
            <Select
                value={accountGroup} // This should be group_name
                onValueChange={(value) => setAccountGroup(value)}
                disabled={!isAccountFormEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="જૂથનું નામ પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="max-h-64">
                  {accountGroups && accountGroups.map((group: any) => (
                    <SelectItem key={group.id} value={group.name}> {/* Ensure value is group.name */}
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
            <Select
                value={accountType}
                onValueChange={(value) => setAccountType(value)}
                disabled={!isAccountFormEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="ખાતાનો પ્રકાર પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="વ્યક્તિ/વેપારી ખાતુ">વ્યક્તિ/વેપારી ખાતુ</SelectItem>
                <SelectItem value="બેંક ખાતુ">બેંક ખાતુ</SelectItem>
                <SelectItem value="રોકડ ખાતુ">રોકડ ખાતુ</SelectItem>
                <SelectItem value="અન્ય ખાતુ">અન્ય ખાતુ</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="accountEffect">ખાતાની અસર</Label>
            <Select
                value={accountEffect}
                onValueChange={(value) => setAccountEffect(value)}
                disabled={!isAccountFormEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="ખાતાની અસર પસંદ કરો" />
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
              <Button
                onClick={handleSaveAccount}
                disabled={!isAccountFormEditable || addAccountMutation.isPending || updateAccountMutation.isPending}
              >
                {addAccountMutation.isPending || updateAccountMutation.isPending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                  <Button
                    variant="destructive"
                    disabled={isAccountFormEditable || !selectedAccount || deleteAccountMutation.isPending}
                  >
                    {deleteAccountMutation.isPending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                {accounts && accounts.map((acc: any) => (
                  <div
                    key={acc.id}
                    className={cn(
                      "cursor-pointer rounded-md p-2 hover:bg-secondary",
                      selectedAccount?.id === acc.id ? "bg-secondary" : ""
                    )}
                    onClick={() => {
                        if (!isAccountFormEditable) { // Allow selection only if form is not in edit mode
                           setSelectedAccount(acc);
                        }
                    }}
                  >
                    {acc.code} - {acc.name} ({acc.group_name})
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
