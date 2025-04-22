'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function ReportPage() {
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

  // Dummy Account List
  const accounts = [
    { id: 1, name: "Cash Account" },
    { id: 2, name: "Bank Account" },
    { id: 3, name: "Sales Account" },
    { id: 4, name: "Purchase Account" },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-6">રિપોર્ટ જનરેશન</h1>

      {/* Account List */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
        <h2 className="text-xl font-semibold mb-3">ખાતાની યાદી</h2>
        <div className="flex items-center space-x-3 mb-3">
          <Label htmlFor="accountListGroupName" className="text-base">જુથનું નામ</Label>
          <Switch id="accountListGroupName" checked={accountListGroupName} onCheckedChange={(checked) => setAccountListGroupName(checked)} />
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <Label htmlFor="accountListAddress" className="text-base">સરનામુ</Label>
          <Switch id="accountListAddress" checked={accountListAddress} onCheckedChange={(checked) => setAccountListAddress(checked)} />
        </div>
        <Button className="h-10">બનાવો</Button>
      </div>

      {/* Voucher Report */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
        <h2 className="text-xl font-semibold mb-3">વાઉચર રિપોર્ટ</h2>
        <div className="mb-3">
          <Label htmlFor="voucherReportVoucherNo" className="text-base">વાઉચર નં</Label>
          <Input id="voucherReportVoucherNo" type="text" value={voucherReportVoucherNo} onChange={(e) => setVoucherReportVoucherNo(e.target.value)} />
        </div>
        <Button className="h-10">બનાવો</Button>
      </div>

      {/* General Account Ledger */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
        <h2 className="text-xl font-semibold mb-3">સામાન્ય ખાતાવહી</h2>
        <div className="mb-3">
          <Label htmlFor="generalAccountLedgerAccountName" className="text-base">ખાતાનું નામ</Label>
          <Select onValueChange={(value) => setGeneralAccountLedgerAccountName(value)}>
            <SelectTrigger>
              <SelectValue placeholder="એકાઉન્ટ પસંદ કરો" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.name}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3 mb-3">
          <Label htmlFor="generalAccountLedgerDetailPrinting" className="text-base">વિગત પ્રિન્ટિંગ</Label>
          <Switch id="generalAccountLedgerDetailPrinting" checked={generalAccountLedgerDetailPrinting} onCheckedChange={(checked) => setGeneralAccountLedgerDetailPrinting(checked)} />
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
                  onSelect={setGeneralAccountLedgerToDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className="h-10">બનાવો</Button>
      </div>

      {/* Day Book */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
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
                  onSelect={setDayBookToDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className="h-10">બનાવો</Button>
      </div>

      {/* Monthly Tarij */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
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
                  selected={monthlyTarijToDate}
                  onSelect={setMonthlyTarijToDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className="h-10">બનાવો</Button>
      </div>

      {/* Profit and loss Account */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
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
                  selected={profitLossAccountToDate}
                  onSelect={setProfitLossAccountToDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className="h-10">બનાવો</Button>
      </div>

      {/* Balance Sheet */}
      <div className="border rounded-md p-4 mb-4 md:mb-5">
        <h2 className="text-xl font-semibold mb-3">સરવૈયું</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="balanceSheetFromDate" className="text-base">From Date</Label>
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
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="balanceSheetToDate" className="text-base">To Date</Label>
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
                  selected={balanceSheetFromDate}
                  onSelect={setBalanceSheetToDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className="h-10">બનાવો</Button>
      </div>
    </div>
  );
}

export default ReportPage;
    
