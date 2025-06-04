"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    // Voucher specific functions
    getNextVoucherNumber,
    addVoucher,
    getVoucherById,
    getAllVouchers, // May not be used directly on this page if navigating by ID
    updateVoucher,
    deleteVoucher,
    getFirstVoucherId,
    getLastVoucherId,
    getPreviousVoucherId,
    getNextVoucherId,
    // General account data
    getAllAccounts
} from '@/lib/db';
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
  const queryClient = useQueryClient();

  // --- State ---
  const [currentVoucherId, setCurrentVoucherId] = useState<number | null>(null);
  const [isEditable, setIsEditable] = useState(false);

  // Form fields state (will be populated by voucherQuery.data or set for new voucher)
  const [voucherType, setVoucherType] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date()); // Default to today for new
  const [voucherNumberDisplay, setVoucherNumberDisplay] = useState("Loading..."); // For display

  const [creditEntries, setCreditEntries] = useState([{ id: 1, account: "", amount: "", details: "" }]);
  const [debitEntries, setDebitEntries] = useState([{ id: 1, account: "", amount: "", details: "" }]);
  const [nextEntryId, setNextEntryId] = useState(2); // For client-side keying of new entries

  // Calculated balances (client-side for now)
  const [openingBalance, setOpeningBalance] = useState("0.00");
  const [closingBalance, setClosingBalance] = useState("0.00");
  const [totalCredit, setTotalCredit] = useState("0.00");
  const [totalDebit, setTotalDebit] = useState("0.00");

  // --- Queries ---
  const { data: accounts = [], isLoading: isLoadingAccounts, error: errorAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
  });

  const { data: nextVoucherNumData, isLoading: isLoadingNextVoucherNum } = useQuery({
    queryKey: ['nextVoucherNumber'],
    queryFn: getNextVoucherNumber,
    enabled: !currentVoucherId && isEditable, // Fetch only when adding new and editable
  });

  const voucherQuery = useQuery({
    queryKey: ['voucher', currentVoucherId],
    queryFn: () => {
      if (!currentVoucherId) return null;
      return getVoucherById(currentVoucherId);
    },
    enabled: !!currentVoucherId,
    onSuccess: (data) => {
      if (data) {
        setVoucherType(data.voucher_type);
        setTransactionType(data.transaction_type || "");
        setDate(data.date ? new Date(data.date) : undefined);
        setVoucherNumberDisplay(data.voucher_number);
        setCreditEntries(data.creditEntries.map((e, i) => ({ ...e, id: i + 1 })) || [{ id: 1, account: "", amount: "", details: "" }]);
        setDebitEntries(data.debitEntries.map((e, i) => ({ ...e, id: i + 1 + (data.creditEntries?.length || 0) })) || [{ id: 1, account: "", amount: "", details: "" }]);
        setNextEntryId((data.creditEntries?.length || 0) + (data.debitEntries?.length || 0) + 1);
        setIsEditable(false); // View mode by default when loading existing
      }
    },
    onError: (error: any) => {
        toast({ variant: "destructive", title: "Error loading voucher", description: error.message });
        setCurrentVoucherId(null); // Reset if voucher not found or error
    }
  });

  // --- Initial Load ---
  useEffect(() => {
    const loadInitialVoucher = async () => {
      try {
        const lastId = await getLastVoucherId();
        if (lastId) {
          setCurrentVoucherId(lastId);
        } else {
          // No vouchers exist, prepare for a new one
          handleAddNew(false); // Call with a flag to not enter edit mode immediately
        }
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error loading initial voucher", description: error.message });
        handleAddNew(false);
      }
    };
    loadInitialVoucher();
  }, []); // Empty dependency array to run once on mount


  // Update voucherNumberDisplay when nextVoucherNumData is available for a new voucher
  useEffect(() => {
    if (!currentVoucherId && isEditable && nextVoucherNumData) {
      setVoucherNumberDisplay(nextVoucherNumData);
    } else if (!currentVoucherId && !isEditable && !voucherQuery.data) {
      // When not adding new, and no voucher loaded (e.g. after deleting last one)
      setVoucherNumberDisplay("N/A");
    }
  }, [currentVoucherId, isEditable, nextVoucherNumData, voucherQuery.data]);

  // Recalculate totals when entries change
  useEffect(() => {
    const credTotal = creditEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
    const debTotal = debitEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
    setTotalCredit(credTotal.toFixed(2));
    setTotalDebit(debTotal.toFixed(2));
    // TODO: Implement opening/closing balance logic if needed based on selected accounts
  }, [creditEntries, debitEntries]);


  // --- Mutations ---
  const addVoucherMutation = useMutation({
    mutationFn: addVoucher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] }); // If displaying a list elsewhere
      queryClient.invalidateQueries({ queryKey: ['nextVoucherNumber'] });
      setCurrentVoucherId(data.id as number); // Load the newly created voucher
      setIsEditable(false);
      toast({ title: "સફળ", description: "વાઉચર સફળતાપૂર્વક ઉમેરાયું." });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "ભૂલ", description: `વાઉચર ઉમેરવામાં નિષ્ફળ: ${error.message}` });
    }
  });

  const updateVoucherMutation = useMutation({
    mutationFn: (variables: { id: number; data: any }) => updateVoucher(variables.id, variables.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['voucher', data.id] }); // Refetch current voucher
      setIsEditable(false);
      toast({ title: "સફળ", description: "વાઉચર સફળતાપૂર્વક અપડેટ થયું." });
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "ભૂલ", description: `વાઉચર અપડેટ કરવામાં નિષ્ફળ: ${error.message}` });
    }
  });

  const deleteVoucherMutation = useMutation({
    mutationFn: deleteVoucher,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['nextVoucherNumber'] });
      toast({ title: "સફળ", description: "વાઉચર સફળતાપૂર્વક ડિલીટ થયું." });

      // Navigate to previous or new after delete
      const lastId = await getLastVoucherId(); // Or getPrevious, depending on desired UX
      if (lastId) {
        setCurrentVoucherId(lastId);
      } else {
        handleAddNew(false); // Prepare for new if no vouchers left
      }
    },
    onError: (error: any) => {
      toast({ variant: "destructive", title: "ભૂલ", description: `વાઉચર ડિલીટ કરવામાં નિષ્ફળ: ${error.message}` });
    }
  });

  // --- Handlers ---
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

  const handleAddNew = (enterEditMode = true) => {
    setCurrentVoucherId(null); // Important to clear current voucher ID
    voucherQuery.remove(); // Remove cached data for previous voucher

    setVoucherType("");
    setTransactionType("");
    setDate(new Date()); // Default to today
    // voucherNumberDisplay will be set by useEffect or if nextVoucherNumData is already there
    setCreditEntries([{ id: 1, account: "", amount: "", details: "" }]);
    setDebitEntries([{ id: 1, account: "", amount: "", details: "" }]);
    setNextEntryId(2);
    setTotalCredit("0.00");
    setTotalDebit("0.00");
    // queryClient.invalidateQueries({ queryKey: ['nextVoucherNumber'] }); //
    if (enterEditMode) {
        setIsEditable(true);
    } else {
        setIsEditable(false); // For initial load if no vouchers
        if (nextVoucherNumData) setVoucherNumberDisplay(nextVoucherNumData);
        else setVoucherNumberDisplay("Loading...");
    }
  };

  const handleEdit = () => {
    if (currentVoucherId && voucherQuery.data) { // Can only edit if a voucher is loaded
        setIsEditable(true);
    } else {
        toast({ variant: "default", title: "નોંધ", description: "કૃપા કરીને સંપાદિત કરવા માટે પહેલા એક વાઉચર લોડ કરો અથવા નવું ઉમેરો."});
    }
  };

  const handleSave = () => {
    // TODO: Implement Save Logic using mutations
    // Validate totals match for Journal/Contra if applicable
    if (voucherType === "Journal" || voucherType === "Contra") {
        if (totalCredit !== totalDebit || parseFloat(totalCredit) === 0) {
            toast({ variant: "destructive", title: "ભૂલ", description: "જર્નલ અને કોન્ટ્રા વાઉચર માટે કુલ જમા અને ઉધાર સરખા હોવા જોઈએ અને શૂન્ય ન હોવા જોઈએ."});
            return;
        }
    }

    const voucherDataToSave = {
        voucher_number: voucherNumberDisplay,
        voucher_type: voucherType,
        transaction_type: transactionType,
        date: date ? date.toISOString() : new Date().toISOString(),
        creditEntries: creditEntries.filter(e => e.account && parseFloat(e.amount || "0") > 0),
        debitEntries: debitEntries.filter(e => e.account && parseFloat(e.amount || "0") > 0),
    };

    if (!voucherDataToSave.voucher_type) {
        toast({variant: "destructive", title: "ભૂલ", description: "કૃપા કરીને પાવતીનો પ્રકાર પસંદ કરો."});
        return;
    }
    if (voucherDataToSave.creditEntries.length === 0 && voucherDataToSave.debitEntries.length === 0) {
        toast({variant: "destructive", title: "ભૂલ", description: "ઓછામાં ઓછી એક જમા અથવા ઉધાર એન્ટ્રી ઉમેરો."});
        return;
    }

    // Basic validation for empty entries if any exist (e.g. user added a line but didn't fill it)
    const hasIncompleteEntries = creditEntries.some(e => (e.account && !e.amount) || (!e.account && e.amount)) ||
                                debitEntries.some(e => (e.account && !e.amount) || (!e.account && e.amount));
    if (hasIncompleteEntries) {
        toast({variant: "destructive", title: "ભૂલ", description: "કૃપા કરીને બધી એન્ટ્રીમાં ખાતું અને રકમ ભરો."});
        return;
    }


    if (currentVoucherId) {
      updateVoucherMutation.mutate({ id: currentVoucherId, data: voucherDataToSave });
    } else {
      addVoucherMutation.mutate(voucherDataToSave);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    // If editing an existing voucher, refetch/revert to its original state
    if (currentVoucherId) {
      voucherQuery.refetch();
    } else {
      // If was adding a new one, load the last voucher or prepare for new if none
      const loadLastOrCreateNew = async () => {
        const lastId = await getLastVoucherId();
        if (lastId) setCurrentVoucherId(lastId);
        else handleAddNew(false);
      }
      loadLastOrCreateNew();
    }
  };

  const handleCopy = () => {
    if (!voucherQuery.data) {
        toast({variant: "default", title: "નોંધ", description: "કૉપિ કરવા માટે પ્રથમ વાઉચર લોડ કરો."});
        return;
    }
    setCurrentVoucherId(null); // New voucher, so no ID
    // voucherNumberDisplay will be handled by nextVoucherNum query
    // Date can be set to today or copied date
    setDate(new Date()); // Or: setDate(voucherQuery.data.date ? new Date(voucherQuery.data.date) : new Date());
    // Credit/Debit entries are already populated from the loaded voucher
    setIsEditable(true); // Enter edit mode
    toast({title: "વાઉચર કૉપિ થયું", description: "વિગતોમાં ફેરફાર કરી સેવ કરો."});
  };

  const handleDelete = () => {
    if (!currentVoucherId) {
        toast({variant: "destructive", title: "ભૂલ", description: "ડિલીટ કરવા માટે કોઈ વાઉચર પસંદ કરેલ નથી."});
        return;
    }
    deleteVoucherMutation.mutate(currentVoucherId);
  };

  const navigateToVoucher = async (idPromise: Promise<number | null>) => {
    try {
        const id = await idPromise;
        if (id) {
            setCurrentVoucherId(id);
        } else {
            toast({variant: "default", title: "નોંધ", description: "આગળ કોઈ વાઉચર નથી."});
        }
    } catch (error: any) {
        toast({variant: "destructive", title: "નેવિગેશન ભૂલ", description: error.message});
    }
  };

  const handleNavigateFirst = () => navigateToVoucher(getFirstVoucherId());
  const handleNavigatePrevious = () => {
    if (voucherQuery.data) {
        navigateToVoucher(getPreviousVoucherId(voucherQuery.data.date, voucherQuery.data.id));
    }
  };
  const handleNavigateNext = () => {
    if (voucherQuery.data) {
        navigateToVoucher(getNextVoucherId(voucherQuery.data.date, voucherQuery.data.id));
    }
  };
  const handleNavigateLast = () => navigateToVoucher(getLastVoucherId());

  const isLoading = isLoadingAccounts ||
                    (voucherQuery.isLoading && !!currentVoucherId) ||
                    (isLoadingNextVoucherNum && !currentVoucherId && isEditable) ||
                    addVoucherMutation.isPending ||
                    updateVoucherMutation.isPending ||
                    deleteVoucherMutation.isPending;

  if (isLoading && !voucherQuery.isError) { // Show main loading only if not an error state already showing for voucher
    return <div className="flex justify-center items-center h-screen"><Icons.spinner className="h-10 w-10 animate-spin" /> <span className="ml-2">લોડિંગ ડેટા...</span></div>;
  }

  if (errorAccounts) return <p>એકાઉન્ટ લોડ કરવામાં ભૂલ: {(errorAccounts as Error).message}</p>;
  if (voucherQuery.isError && currentVoucherId) return <p>વાઉચર લોડ કરવામાં ભૂલ: {(voucherQuery.error as Error).message}</p>;


  return (
    <div className="p-4 md:p-6 flex flex-col w-full">
      <div className="mb-4 md:mb-5 flex justify-between items-center">
        <h1 className="text-xl font-bold">વાઉચર એન્ટ્રી</h1>
        <Button onClick={() => handleAddNew()} disabled={isEditable || addVoucherMutation.isPending || updateVoucherMutation.isPending} variant="primary">નવું ઉમેરો</Button>
      </div>

      {/* Header Section */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 md:mb-5">
          <div>
            <Label htmlFor="voucherType" className="text-base">પાવતીનો પ્રકાર</Label>
            <Select value={voucherType} disabled={!isEditable} onValueChange={handleVoucherTypeChange}>
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
            <Select value={transactionType} disabled={!isEditable || voucherType === 'Journal' || voucherType === 'Contra'} onValueChange={handleTransactionTypeChange}>
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
                    disabled={!isEditable || isLoadingNextVoucherNum}
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
                    disabled={!isEditable || isLoadingNextVoucherNum}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          </div>
          <div>
            <Label htmlFor="voucherNumber" className="text-base">વાઉચર નં</Label>
            <Input
              id="voucherNumber"
              type="text"
              value={isLoadingNextVoucherNum && !currentVoucherId && isEditable ? "Loading..." : voucherNumberDisplay}
              disabled
              className="text-sm"
            />
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
                    {accounts && accounts.map((account:any) => (
                      <SelectItem key={account.id} value={account.name} className="text-sm">
                        {account.name} ({account.code})
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
                    {accounts && accounts.map((account:any) => (
                      <SelectItem key={account.id} value={account.name} className="text-sm">
                         {account.name} ({account.code})
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
                  <Button variant="destructive" disabled={isEditable || !currentVoucherId || deleteVoucherMutation.isPending} className="text-base">
                    {deleteVoucherMutation.isPending ? <Icons.spinner className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                  </Button>
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
                    <AlertDialogAction onClick={handleDelete}>કાઢી નાખો</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
             <Button onClick={handleCopy} disabled={isEditable || !currentVoucherId || voucherQuery.isFetching} variant="standard" className="text-base"><Copy className="h-4 w-4" /></Button>
              <Button onClick={handleEdit} disabled={isEditable || !currentVoucherId || voucherQuery.isFetching} variant="standard" className="text-base"><Edit className="h-4 w-4" /></Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!isEditable || addVoucherMutation.isPending || updateVoucherMutation.isPending} variant="primary" className="text-base">
                {addVoucherMutation.isPending || updateVoucherMutation.isPending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/> : null}
                સેવ કરો
            </Button>
            <Button variant="secondary" onClick={handleCancel} disabled={!isEditable} className="text-base">રદ કરો</Button>
          </div>
        </div>

          {/*Navigation Buttons*/}
          <div className="flex justify-center gap-2 mt-4">
            <Button onClick={handleNavigateFirst} disabled={isEditable || voucherQuery.isFetching || addVoucherMutation.isPending || updateVoucherMutation.isPending} variant="standard" className="text-base">&lt;&lt;</Button>
            <Button onClick={handleNavigatePrevious} disabled={isEditable || voucherQuery.isFetching || addVoucherMutation.isPending || updateVoucherMutation.isPending} variant="standard" className="text-base">&lt;</Button>
            <Button onClick={handleNavigateNext} disabled={isEditable || voucherQuery.isFetching || addVoucherMutation.isPending || updateVoucherMutation.isPending} variant="standard" className="text-base">&gt;</Button>
            <Button onClick={handleNavigateLast} disabled={isEditable || voucherQuery.isFetching || addVoucherMutation.isPending || updateVoucherMutation.isPending} variant="standard" className="text-base">&gt;&gt;</Button>
          </div>
        </div>
    </div>
  );
}

export default VoucherPage;
