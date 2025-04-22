"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Copy, Edit, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function VoucherPage() {
  const { toast } = useToast();

  // Voucher Header State
  const [voucherType, setVoucherType] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [voucherNumber, setVoucherNumber] = useState("Auto-Generated"); // Readonly

  // Entry Line State
  const [creditEntries, setCreditEntries] = useState([{ id: 1, account: "", amount: "", details: "" }]);
  const [debitEntries, setDebitEntries] = useState([{ id: 1, account: "", amount: "", details: "" }]);
  const [nextEntryId, setNextEntryId] = useState(2);

  // Balance State
  const [openingBalance, setOpeningBalance] = useState("0.00"); // Replace with actual calculation
  const [closingBalance, setClosingBalance] = useState("0.00"); // Replace with actual calculation
  const [totalCredit, setTotalCredit] = useState("0.00");
  const [totalDebit, setTotalDebit] = useState("0.00");

  // Workflow State
  const [isEditable, setIsEditable] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Track selected voucher for preview/edit

  // Dummy Account List
  const accounts = [
    { id: 1, name: "Cash Account" },
    { id: 2, name: "Bank Account" },
    { id: 3, name: "Sales Account" },
    { id: 4, name: "Purchase Account" },
  ];

  // Handlers
  const handleAddCreditEntry = () => {
    setCreditEntries([...creditEntries, { id: nextEntryId, account: "", amount: "", details: "" }]);
    setNextEntryId(nextEntryId + 1);
  };

  const handleAddDebitEntry = () => {
    setDebitEntries([...debitEntries, { id: nextEntryId, account: "", amount: "", details: "" }]);
    setNextEntryId(nextEntryId + 1);
  };

  const handleRemoveCreditEntry = (id: number) => {
    setCreditEntries(creditEntries.filter((entry) => entry.id !== id));
  };

  const handleRemoveDebitEntry = (id: number) => {
    setDebitEntries(debitEntries.filter((entry) => entry.id !== id));
  };

    const handleVoucherTypeChange = (value: string) => {
        setVoucherType(value);
    };

    const handleTransactionTypeChange = (value: string) => {
        setTransactionType(value);
    };

  const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
    };

  const handleAccountChange = (id: number, side: "credit" | "debit", value: string) => {
    if (side === "credit") {
      setCreditEntries(creditEntries.map(entry => entry.id === id ? { ...entry, account: value } : entry));
    } else {
      setDebitEntries(debitEntries.map(entry => entry.id === id ? { ...entry, account: value } : entry));
    }
  };

  const handleAmountChange = (id: number, side: "credit" | "debit", value: string) => {
    if (side === "credit") {
      setCreditEntries(creditEntries.map(entry => entry.id === id ? { ...entry, amount: value } : entry));
    } else {
      setDebitEntries(debitEntries.map(entry => entry.id === id ? { ...entry, amount: value } : entry));
    }
  };

  const handleDetailsChange = (id: number, side: "credit" | "debit", value: string) => {
    if (side === "credit") {
      setCreditEntries(creditEntries.map(entry => entry.id === id ? { ...entry, details: value } : entry));
    } else {
      setDebitEntries(debitEntries.map(entry => entry.id === id ? { ...entry, details: value } : entry));
    }
  };

  const handleAddNew = () => {
    setIsEditable(true);
    setVoucherType("");
    setTransactionType("");
    setDate(undefined);
    setVoucherNumber("Auto-Generated");
    setCreditEntries([{ id: 1, account: "", amount: "", details: "" }]);
    setDebitEntries([{ id: 1, account: "", amount: "", details: "" }]);
    setNextEntryId(2);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleSave = () => {
    // Implement Save Logic
    setIsEditable(false);
    toast({
      title: "વાઉચર સેવ થયું!",
      description: "તમારું વાઉચર સફળતાપૂર્વક સાચવવામાં આવ્યું છે.",
    });
  };

  const handleCancel = () => {
    setIsEditable(false);
  };

  const handleCopy = () => {
    // Implement Copy Logic
  };

  const handleDelete = () => {
    // Implement Delete Logic
  };

  const handleNavigateFirst = () => {
    // Implement Navigation Logic
  };

  const handleNavigatePrevious = () => {
    // Implement Navigation Logic
  };

  const handleNavigateNext = () => {
    // Implement Navigation Logic
  };

  const handleNavigateLast = () => {
    // Implement Navigation Logic
  };

  return (
    <div className="p-4 md:p-6 flex flex-col w-full">
      <div className="mb-4 md:mb-5 flex justify-between items-center">
        <h1 className="text-xl font-bold">વાઉચર એન્ટ્રી</h1>
        <Button onClick={handleAddNew} disabled={isEditable} variant="standard">નવું ઉમેરો</Button>
      </div>

      {/* Header Section */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 md:mb-5">
          <div>
            <Label htmlFor="voucherType" className="text-base">પાવતીનો પ્રકાર</Label>
            <Select disabled={!isEditable} onValueChange={handleVoucherTypeChange}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="પાવતીનો પ્રકાર પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Contra">Contra</SelectItem>
                <SelectItem value="Journal">Journal</SelectItem>
                <SelectItem value="Payment">Payment</SelectItem>
                <SelectItem value="Receipt">Receipt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="transactionType" className="text-base">લેવડદેવડનો પ્રકાર</Label>
            <Select disabled={!isEditable} onValueChange={handleTransactionTypeChange}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="લેવડદેવડનો પ્રકાર પસંદ કરો" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank/Draft">Bank/Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date" className="text-base">તારીખ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !date && "text-muted-foreground"
                    )}
                    disabled={!isEditable}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date?.toLocaleDateString() : <span>તારીખ પસંદ કરો</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    disabled={!isEditable}
                    // initialFocus
                  />
                </PopoverContent>
              </Popover>
          </div>
          <div>
            <Label htmlFor="voucherNumber" className="text-base">વાઉચર નં</Label>
            <Input id="voucherNumber" type="text" value={voucherNumber} disabled className="text-sm"/>
          </div>
        </div>
      </div>

      {/* Entry Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-5">
        {/* Credit Entries */}
        <div className="border rounded-md p-4 bg-card">
          <Label className="text-lg">જમા ખાતે</Label>
          <ScrollArea className="h-[300px] w-full rounded-md border p-3">
            {creditEntries.map((entry) => (
              <div key={entry.id} className="mb-3 flex flex-col gap-2">
                <Select disabled={!isEditable} onValueChange={(value) => handleAccountChange(entry.id, "credit", value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="એકાઉન્ટ પસંદ કરો" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.name} className="text-sm">
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="રૂકમ"
                  value={entry.amount}
                  onChange={(e) => handleAmountChange(entry.id, "credit", e.target.value)}
                  disabled={!isEditable}
                  className="text-sm"
                />
                <Textarea
                  placeholder="વિગત"
                  value={entry.details}
                  onChange={(e) => handleDetailsChange(entry.id, "credit", e.target.value)}
                  disabled={!isEditable}
                  className="mt-1 text-sm"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveCreditEntry(entry.id)} disabled={!isEditable} className="self-start">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
          <Button onClick={handleAddCreditEntry} disabled={!isEditable} variant="standard" className="mt-3 w-full"> + જમા લાઇન ઉમેરો</Button>
        </div>

        {/* Debit Entries */}
        <div className="border rounded-md p-4 bg-card">
          <Label className="text-lg">ઉધાર ખાતે</Label>
          <ScrollArea className="h-[300px] w-full rounded-md border p-3">
            {debitEntries.map((entry) => (
              <div key={entry.id} className="mb-3 flex flex-col gap-2">
                <Select disabled={!isEditable} onValueChange={(value) => handleAccountChange(entry.id, "debit", value)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="એકાઉન્ટ પસંદ કરો" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.name} className="text-sm">
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="રૂકમ"
                  value={entry.amount}
                  onChange={(e) => handleAmountChange(entry.id, "debit", e.target.value)}
                  disabled={!isEditable}
                  className="text-sm"
                />
                 <Textarea
                  placeholder="વિગત"
                  value={entry.details}
                  onChange={(e) => handleDetailsChange(entry.id, "debit", e.target.value)}
                  disabled={!isEditable}
                  className="mt-1 text-sm"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveDebitEntry(entry.id)} disabled={!isEditable} className="self-start">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
          <Button onClick={handleAddDebitEntry} disabled={!isEditable} variant="standard" className="mt-3 w-full">+ ઉધાર લાઇન ઉમેરો</Button>
        </div>
      </div>

      {/* Balances and Totals */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 md:mb-5">
          <div>
            <Label className="text-base">ખુલતી સિલક</Label>
            <Input type="text" value={openingBalance} disabled className="text-sm"/>
          </div>
          <div>
            <Label className="text-base">કુલ જમા</Label>
            <Input type="text" value={totalCredit} disabled className="text-sm"/>
          </div>
          <div>
            <Label className="text-base">કુલ ઉધાર</Label>
            <Input type="text" value={totalDebit} disabled className="text-sm"/>
          </div>
          <div>
            <Label className="text-base">બંધ સિલક</Label>
            <Input type="text" value={closingBalance} disabled className="text-sm"/>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isEditable} className="text-base"><Trash2 className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>શું તમે ખરેખર કાઢી નાખવા માંગો છો?</AlertDialogTitle>
                    <AlertDialogDescription>
                      આ ક્રિયા પૂર્વવત્ કરી શકાતી નથી. શું તમે ખાતરી કરો છો કે તમે આ વાઉચર કાઢી નાખવા માંગો છો?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>રદ કરો</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      handleDelete()
                    }}>કાઢી નાખો</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
             <Button onClick={handleCopy} disabled={isEditable} variant="standard" className="text-base"><Copy className="h-4 w-4" /></Button>
              <Button onClick={handleEdit} disabled={isEditable} variant="standard" className="text-base"><Edit className="h-4 w-4" /></Button>
          </div>
          <div className="flex gap-2">
            
            <Button onClick={handleSave} disabled={!isEditable} variant="accent" className="text-base">સેવ કરો</Button>
            <Button variant="secondary" onClick={handleCancel} disabled={!isEditable} className="text-base">રદ કરો</Button>
          </div>
        </div>

          {/*Navigation Buttons*/}
          <div className="flex justify-center gap-2 mt-4">
            <Button onClick={handleNavigateFirst} disabled={isEditable} variant="standard" className="text-base">&lt;&lt;</Button>
            <Button onClick={handleNavigatePrevious} disabled={isEditable} variant="standard" className="text-base">&lt;</Button>
            <Button onClick={handleNavigateNext} disabled={isEditable} variant="standard" className="text-base">&gt;</Button>
            <Button onClick={handleNavigateLast} disabled={isEditable} variant="standard" className="text-base">&gt;&gt;</Button>
          </div>
        </div>
    </div>
  );
}

export default VoucherPage;
