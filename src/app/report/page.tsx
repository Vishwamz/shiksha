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
    <div className="p-6"> {/* Increased padding */}
      <h1 className="text-3xl font-bold mb-6">રિપોર્ટ જનરેશન</h1>{/* Increased font size and margin */}

      {/* Account List */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-3">ખાતાની યાદી</h2>{/* Increased font size and margin */}
        <div className="flex items-center space-x-3 mb-3"> {/* Increased space and margin */}
          <Label htmlFor="accountListGroupName" className="text-lg">જુથનું નામ</Label>{/* Increased font size */}
          <Switch id="accountListGroupName" checked={accountListGroupName} onCheckedChange={(checked) => setAccountListGroupName(checked)} />
        </div>
        <div className="flex items-center space-x-3 mb-4"> {/* Increased space and margin */}
          <Label htmlFor="accountListAddress" className="text-lg">સરનામુ</Label>{/* Increased font size */}
          <Switch id="accountListAddress" checked={accountListAddress} onCheckedChange={(checked) => setAccountListAddress(checked)} />
        </div>
        <Button className="h-12 text-lg">બનાવો</Button>{/* Increased height and font size */}
      </div>

      {/* Voucher Report */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-3">વાઉચર રિપોર્ટ</h2>{/* Increased font size and margin */}
        <div className="mb-3"> {/* Increased margin */}
          <Label htmlFor="voucherReportVoucherNo" className="text-lg">વાઉચર નં</Label>{/* Increased font size */}
          <Input id="voucherReportVoucherNo" type="text" value={voucherReportVoucherNo} onChange={(e) => setVoucherReportVoucherNo(e.target.value)} className="text-lg" />{/* Increased font size */}
        </div>
        <Button className="h-12 text-lg">બનાવો</Button>{/* Increased height and font size */}
      </div>

      {/* General Account Ledger */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-3">સામાન્ય ખાતાવહી</h2>{/* Increased font size and margin */}
        <div className="mb-3"> {/* Increased margin */}
          <Label htmlFor="generalAccountLedgerAccountName" className="text-lg">ખાતાનું નામ</Label>{/* Increased font size */}
          <Select onValueChange={(value) => setGeneralAccountLedgerAccountName(value)}>
            <SelectTrigger className="text-lg">
              <SelectValue placeholder="એકાઉન્ટ પસંદ કરો" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.name} className="text-lg">{/* Increased font size */}
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-3 mb-3"> {/* Increased space and margin */}
          <Label htmlFor="generalAccountLedgerDetailPrinting" className="text-lg">વિગત પ્રિન્ટિંગ</Label>{/* Increased font size */}
          <Switch id="generalAccountLedgerDetailPrinting" checked={generalAccountLedgerDetailPrinting} onCheckedChange={(checked) => setGeneralAccountLedgerDetailPrinting(checked)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"> {/* Increased gap and margin */}
          <div>
            <Label htmlFor="generalAccountLedgerFromDate" className="text-lg">From Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !generalAccountLedgerFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
            <Label htmlFor="generalAccountLedgerToDate" className="text-lg">To Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !generalAccountLedgerToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
        <Button className="h-12 text-lg">બનાવો</Button>{/* Increased height and font size */}
      </div>

      {/* Day Book */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-3">રોજમેળ</h2>{/* Increased font size and margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"> {/* Increased gap and margin */}
          <div>
            <Label htmlFor="dayBookFromDate" className="text-lg">From Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !dayBookFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
            <Label htmlFor="dayBookToDate" className="text-lg">To Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !dayBookToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
        <Button className="h-12 text-lg">બનાવો</Button>{/* Increased height and font size */}
      </div>

      {/* Monthly Tarij */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-3">માસિક સરવાળા</h2>{/* Increased font size and margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"> {/* Increased gap and margin */}
          <div>
            <Label htmlFor="monthlyTarijFromDate" className="text-lg">From Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !monthlyTarijFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
            <Label htmlFor="monthlyTarijToDate" className="text-lg">To Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !monthlyTarijToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
                  {monthlyTarijToDate ? monthlyTarijToDate?.toLocaleDateString() : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  selected={monthlyTarijFromDate}
                  onSelect={setMonthlyTarijToDate}
                  // initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className="h-12 text-lg">બનાવો</Button>{/* Increased height and font size */}
      </div>

      {/* Profit and loss Account */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-3">નફા નુકશાન ખાતુ</h2>{/* Increased font size and margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"> {/* Increased gap and margin */}
          <div>
            <Label htmlFor="profitLossAccountFromDate" className="text-lg">From Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !profitLossAccountFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
            <Label htmlFor="profitLossAccountToDate" className="text-lg">To Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !profitLossAccountToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
        <Button className="h-12 text-lg">બનાવો</Button>{/* Increased height and font size */}
      </div>

      {/* Balance Sheet */}
      <div className="border rounded-md p-5 mb-5"> {/* Increased padding and margin */}
        <h2 className="text-xl font-semibold mb-3">સરવૈયું</h2>{/* Increased font size and margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"> {/* Increased gap and margin */}
          <div>
            <Label htmlFor="balanceSheetFromDate" className="text-lg">From Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !balanceSheetFromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
            <Label htmlFor="balanceSheetToDate" className="text-lg">To Date</Label>{/* Increased font size */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-lg",
                    !balanceSheetToDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />{/* Increased icon size */}
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
        <Button className="h-12 text-lg">બનાવો</Button>{/* Increased height and font size */}
      </div>
    </div>
  );
}

export default ReportPage;
