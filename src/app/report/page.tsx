"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getAccountListReport,
    getVoucherByVoucherNumber,
    getGeneralLedger,
    getDayBook,
    getMonthlyTarij,
    getProfitLoss,
    getBalanceSheet,
    getAllAccounts // For dropdown
} from '@/lib/db';
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons"; // For spinner

function ReportPage() {
  const queryClient = useQueryClient();
  const [reportData, setReportData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states (existing)
  const [accountListGroupName, setAccountListGroupName] = useState(false);
  const [accountListAddress, setAccountListAddress] = useState(false);
  const [voucherReportVoucherNo, setVoucherReportVoucherNo] = useState("");
  const [generalAccountLedgerAccountName, setGeneralAccountLedgerAccountName] = useState("");
  const [generalAccountLedgerDetailPrinting, setGeneralAccountLedgerDetailPrinting] = useState(false);
  const [generalAccountLedgerFromDate, setGeneralAccountLedgerFromDate] = useState<Date | undefined>(undefined);
  const [generalAccountLedgerToDate, setGeneralAccountLedgerToDate] = useState<Date | undefined>(undefined);
  const [dayBookFromDate, setDayBookFromDate] = useState<Date | undefined>(undefined);
  const [dayBookToDate, setDayBookToDate] = useState<Date | undefined>(undefined);
  const [monthlyTarijFromDate, setMonthlyTarijFromDate] = useState<Date | undefined>(undefined);
  const [monthlyTarijToDate, setMonthlyTarijToDate] = useState<Date | undefined>(undefined);
  const [profitLossAccountFromDate, setProfitLossAccountFromDate] = useState<Date | undefined>(undefined);
  const [profitLossAccountToDate, setProfitLossAccountToDate] = useState<Date | undefined>(undefined);
  const [balanceSheetFromDate, setBalanceSheetFromDate] = useState<Date | undefined>(undefined);
  const [balanceSheetToDate, setBalanceSheetToDate] = useState<Date | undefined>(undefined);

  // Fetch accounts for dropdowns
  const { data: accountsList = [], isLoading: isLoadingAccounts } = useQuery({
      queryKey: ['allAccountsForReport'],
      queryFn: getAllAccounts
  });

  const safeFormatDate = (date: Date | undefined) => {
    if (!date) return '';
    try {
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };

  const handleGenerateAccountList = async () => {
      setIsGenerating(true);
      setReportData(null);
      try {
          const data = await getAccountListReport(accountListGroupName, accountListAddress);
          setReportData({ title: "ખાતાની યાદી", data });
      } catch (error: any) {
          console.error("Error generating account list:", error);
          setReportData({ title: "ખાતાની યાદી", error: error.message });
      } finally {
          setIsGenerating(false);
      }
  };

  const handleGenerateVoucherReport = async () => {
    setIsGenerating(true);
    setReportData(null);
    if (!voucherReportVoucherNo.trim()) {
        setReportData({ title: "વાઉચર રિપોર્ટ", error: "કૃપા કરીને વાઉચર નંબર દાખલ કરો." });
        setIsGenerating(false);
        return;
    }
    try {
        const data = await getVoucherByVoucherNumber(voucherReportVoucherNo.trim());
        setReportData({ title: `વાઉચર રિપોર્ટ: ${voucherReportVoucherNo}`, data });
    } catch (error: any) {
        setReportData({ title: `વાઉચર રિપોર્ટ: ${voucherReportVoucherNo}`, error: error.message });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateGeneralLedger = async () => {
    setIsGenerating(true);
    setReportData(null);
    if (!generalAccountLedgerAccountName) {
        setReportData({ title: "સામાન્ય ખાતાવહી", error: "કૃપા કરીને ખાતાનું નામ પસંદ કરો." });
        setIsGenerating(false);
        return;
    }
    if (!generalAccountLedgerFromDate || !generalAccountLedgerToDate) {
        setReportData({ title: "સામાન્ય ખાતાવહી", error: "કૃપા કરીને From Date અને To Date પસંદ કરો." });
        setIsGenerating(false);
        return;
    }
    try {
        const data = await getGeneralLedger(
            generalAccountLedgerAccountName,
            safeFormatDate(generalAccountLedgerFromDate),
            safeFormatDate(generalAccountLedgerToDate)
        );
        setReportData({ title: `સામાન્ય ખાતાવહી: ${generalAccountLedgerAccountName}`, data });
    } catch (error: any) {
        setReportData({ title: `સામાન્ય ખાતાવહી: ${generalAccountLedgerAccountName}`, error: error.message });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateDayBook = async () => {
    setIsGenerating(true);
    setReportData(null);
    if (!dayBookFromDate || !dayBookToDate) {
        setReportData({ title: "રોજમેળ", error: "કૃપા કરીને From Date અને To Date પસંદ કરો." });
        setIsGenerating(false);
        return;
    }
    try {
        const data = await getDayBook(safeFormatDate(dayBookFromDate), safeFormatDate(dayBookToDate));
        setReportData({ title: "રોજમેળ", data });
    } catch (error: any) {
        setReportData({ title: "રોજમેળ", error: error.message });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateMonthlyTarij = async () => {
    setIsGenerating(true);
    setReportData(null);
     if (!monthlyTarijFromDate || !monthlyTarijToDate) {
        setReportData({ title: "માસિક સરવાળા", error: "કૃપા કરીને From Date અને To Date પસંદ કરો." });
        setIsGenerating(false);
        return;
    }
    try {
        const data = await getMonthlyTarij(safeFormatDate(monthlyTarijFromDate), safeFormatDate(monthlyTarijToDate));
        setReportData({ title: "માસિક સરવાળા", ...data });
    } catch (error: any) {
        setReportData({ title: "માસિક સરવાળા", error: error.message });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateProfitLoss = async () => {
    setIsGenerating(true);
    setReportData(null);
    if (!profitLossAccountFromDate || !profitLossAccountToDate) {
        setReportData({ title: "નફા નુકશાન ખાતુ", error: "કૃપા કરીને From Date અને To Date પસંદ કરો." });
        setIsGenerating(false);
        return;
    }
    try {
        const data = await getProfitLoss(safeFormatDate(profitLossAccountFromDate), safeFormatDate(profitLossAccountToDate));
        setReportData({ title: "નફા નુકશાન ખાતુ", ...data });
    } catch (error: any) {
        setReportData({ title: "નફા નુકશાન ખાતુ", error: error.message });
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateBalanceSheet = async () => {
    setIsGenerating(true);
    setReportData(null);
    if (!balanceSheetToDate) { // Balance sheet is typically "As on date"
        setReportData({ title: "સરવૈયું", error: "કૃપા કરીને 'As on Date' પસંદ કરો." });
        setIsGenerating(false);
        return;
    }
    try {
        const data = await getBalanceSheet(safeFormatDate(balanceSheetToDate));
        setReportData({ title: "સરવૈયું", ...data });
    } catch (error: any) {
        setReportData({ title: "સરવૈયું", error: error.message });
    } finally {
        setIsGenerating(false);
    }
  };

  if (isLoadingAccounts) {
    return <div className="flex justify-center items-center h-screen"><Icons.spinner className="h-8 w-8 animate-spin" /> Loading account data...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-6">રિપોર્ટ જનરેશન</h1>

      {/* Account List */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <h2 className="text-xl font-semibold mb-3">ખાતાની યાદી</h2>
        <div className="flex items-center space-x-3 mb-3">
          <Label htmlFor="accountListGroupName" className="text-base">જુથનું નામ</Label>
          <Switch id="accountListGroupName" checked={accountListGroupName} onCheckedChange={setAccountListGroupName} />
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <Label htmlFor="accountListAddress" className="text-base">સરનામુ</Label>
          <Switch id="accountListAddress" checked={accountListAddress} onCheckedChange={setAccountListAddress} />
        </div>
        <Button onClick={handleGenerateAccountList} disabled={isGenerating} className="h-10">
          {isGenerating ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "બનાવો"}
        </Button>
      </div>

      {/* Voucher Report */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <h2 className="text-xl font-semibold mb-3">વાઉચર રિપોર્ટ</h2>
        <div className="mb-3">
          <Label htmlFor="voucherReportVoucherNo" className="text-base">વાઉચર નં</Label>
          <Input id="voucherReportVoucherNo" type="text" value={voucherReportVoucherNo} onChange={(e) => setVoucherReportVoucherNo(e.target.value)} />
        </div>
        <Button onClick={handleGenerateVoucherReport} disabled={isGenerating} className="h-10">
         {isGenerating ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "બનાવો"}
        </Button>
      </div>

      {/* General Account Ledger */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <h2 className="text-xl font-semibold mb-3">સામાન્ય ખાતાવહી</h2>
        <div className="mb-3">
          <Label htmlFor="generalAccountLedgerAccountName" className="text-base">ખાતાનું નામ</Label>
          <Select value={generalAccountLedgerAccountName} onValueChange={setGeneralAccountLedgerAccountName}>
            <SelectTrigger>
              <SelectValue placeholder="એકાઉન્ટ પસંદ કરો" />
            </SelectTrigger>
            <SelectContent>
              {accountsList.map((account: any) => (
                <SelectItem key={account.id} value={account.name}>
                  {account.name} ({account.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3 mb-3">
          <Label htmlFor="generalAccountLedgerDetailPrinting" className="text-base">વિગત પ્રિન્ટિંગ</Label>
          <Switch id="generalAccountLedgerDetailPrinting" checked={generalAccountLedgerDetailPrinting} onCheckedChange={setGeneralAccountLedgerDetailPrinting} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="generalAccountLedgerFromDate" className="text-base">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !generalAccountLedgerFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {generalAccountLedgerFromDate ? generalAccountLedgerFromDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={generalAccountLedgerFromDate}
                  onSelect={setGeneralAccountLedgerFromDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="generalAccountLedgerToDate" className="text-base">To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !generalAccountLedgerToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {generalAccountLedgerToDate ? generalAccountLedgerToDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={generalAccountLedgerToDate}
                    onSelect={setGeneralAccountLedgerFromDate}
                    initialFocus
                    onSelect={setGeneralAccountLedgerToDate}
                    initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button onClick={handleGenerateGeneralLedger} disabled={isGenerating} className="h-10">
         {isGenerating ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "બનાવો"}
        </Button>
      </div>

      {/* Day Book */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <h2 className="text-xl font-semibold mb-3">રોજમેળ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="dayBookFromDate" className="text-base">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !dayBookFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dayBookFromDate ? dayBookFromDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={dayBookFromDate}
                  onSelect={setDayBookFromDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="dayBookToDate" className="text-base">To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !dayBookToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dayBookToDate ? dayBookToDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={dayBookToDate}
                    onSelect={setDayBookFromDate}
                    initialFocus
                    onSelect={setDayBookToDate}
                    initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button onClick={handleGenerateDayBook} disabled={isGenerating} className="h-10">
         {isGenerating ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "બનાવો"}
        </Button>
      </div>

      {/* Monthly Tarij */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <h2 className="text-xl font-semibold mb-3">માસિક સરવાળા</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="monthlyTarijFromDate" className="text-base">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !monthlyTarijFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {monthlyTarijFromDate ? monthlyTarijFromDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={monthlyTarijFromDate}
                  onSelect={setMonthlyTarijFromDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="monthlyTarijToDate" className="text-base">To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !monthlyTarijToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {monthlyTarijToDate ? monthlyTarijToDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={monthlyTarijFromDate}
                    onSelect={setMonthlyTarijFromDate}
                    initialFocus
                    selected={monthlyTarijToDate}
                    onSelect={setMonthlyTarijToDate}
                    initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button onClick={handleGenerateMonthlyTarij} disabled={isGenerating} className="h-10">
         {isGenerating ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "બનાવો"}
        </Button>
      </div>

      {/* Profit and loss Account */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <h2 className="text-xl font-semibold mb-3">નફા નુકશાન ખાતુ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="profitLossAccountFromDate" className="text-base">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !profitLossAccountFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {profitLossAccountFromDate ? profitLossAccountFromDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={profitLossAccountFromDate}
                  onSelect={setProfitLossAccountFromDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="profitLossAccountToDate" className="text-base">To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !profitLossAccountToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {profitLossAccountToDate ? profitLossAccountToDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={profitLossAccountFromDate}
                    onSelect={setProfitLossAccountFromDate}
                    initialFocus
                    selected={profitLossAccountToDate}
                    onSelect={setProfitLossAccountToDate}
                    initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button onClick={handleGenerateProfitLoss} disabled={isGenerating} className="h-10">
         {isGenerating ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "બનાવો"}
        </Button>
      </div>

      {/* Balance Sheet */}
      <div className="border rounded-md p-4 mb-4 md:mb-5 bg-card">
        <h2 className="text-xl font-semibold mb-3">સરવૈયું</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="balanceSheetFromDate" className="text-base">From Date (Not typically used for B/S)</Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !balanceSheetFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {balanceSheetFromDate ? balanceSheetFromDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={balanceSheetFromDate}
                  onSelect={setBalanceSheetFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="balanceSheetToDate" className="text-base">As on Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !balanceSheetToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {balanceSheetToDate ? balanceSheetToDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={balanceSheetToDate}
                  onSelect={setBalanceSheetToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button onClick={handleGenerateBalanceSheet} disabled={isGenerating} className="h-10">
         {isGenerating ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "બનાવો"}
        </Button>
      </div>

      {/* Report Display Area */}
      {reportData && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">{reportData.title}</h3>
          {reportData.error && <p className="text-red-500">{reportData.error}</p>}
          {reportData.data && <pre className="text-sm overflow-x-auto bg-white p-2 rounded">{JSON.stringify(reportData.data, null, 2)}</pre>}
          {reportData.message && <p className="text-blue-600">{reportData.message}</p>}
        </div>
      )}
    </div>
  );
}

export default ReportPage;
