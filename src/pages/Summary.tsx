import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, DollarSign, CalendarIcon } from 'lucide-react';
import {  getDateRangeFromFilter, isDateInRange } from '@/lib/date-utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SummaryEntry {
  id: string;
  date: string;
  description: string;
  plnAmount: number;
  inrAmount: number;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const filterEntries = (entries: SummaryEntry[], yearMonth: string) => {
  if (!yearMonth) return entries;
  const [year, month] = yearMonth.split('-');
  const targetMonth = months.indexOf(month) +1;

  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getFullYear().toString() === year && entryDate.getMonth() + 1 === targetMonth;
  });
};

export default function Summary() {
  const [entries, setEntries] = useState<SummaryEntry[]>([]);
  const [dateFilter, setDateFilter] = useState<string>(''); // Changed to string to hold year-month
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [plnAmount, setPlnAmount] = useState('');
  const [inrAmount, setInrAmount] = useState('');

  const filteredEntries = useMemo(() => {
    return filterEntries(entries, dateFilter);
  }, [entries, dateFilter]);

  useEffect(() => {
    const savedEntries = localStorage.getItem('currencyEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currencyEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: SummaryEntry = {
      id: Date.now().toString(),
      date,
      description,
      plnAmount: parseFloat(plnAmount),
      inrAmount: parseFloat(inrAmount),
    };

    setEntries([...entries, newEntry]);
    setDate('');
    setDescription('');
    setPlnAmount('');
    setInrAmount('');
  };

  const totalPLN = filteredEntries.reduce((sum, entry) => sum + entry.plnAmount, 0);
  const totalINR = filteredEntries.reduce((sum, entry) => sum + entry.inrAmount, 0);
  const avgPLNtoINR = totalPLN && totalINR ? (totalINR / totalPLN).toFixed(2) : '0';

  return (
    <Layout>
      <div className="bg-background p-6 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Currency Summary</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{dateFilter ? dateFilter : 'Select Month and Year'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px]" align="end">
              <DropdownMenuLabel>Filter by Month and Year</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                {[2026, 2025].map(year => {
                  return(
                    <div key={year} className="mb-4">
                      <div className="font-semibold mb-2">{year}</div>
                      <div className="grid grid-cols-4 gap-1">
                        {months.map((month, index) => (
                          <button 
                            key={`${year}-${month}`}
                            onClick={() => setDateFilter(`${year}-${month}`)}
                            className={`text-sm py-1 px-2 rounded hover:bg-gray-100 focus:outline-none ${dateFilter === `${year}-${month}` ? 'bg-gray-200' : ''}`}
                          >
                            {month.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total PLN</CardDescription>
              <CardTitle className="text-lg">{totalPLN.toFixed(2)} PLN</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total INR</CardDescription>
              <CardTitle className="text-lg">{totalINR.toFixed(2)} INR</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(newDate) => {
                    if (newDate) {
                      const adjusted = new Date(newDate);
                      adjusted.setMinutes(adjusted.getMinutes() - adjusted.getTimezoneOffset());
                      setDate(adjusted.toISOString().slice(0, 10));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Amount (PLN)"
                value={plnAmount}
                onChange={(e) => setPlnAmount(e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Amount (INR)"
                value={inrAmount}
                onChange={(e) => setInrAmount(e.target.value)}
                required
              />
              <Button type="submit">Add</Button>
            </div>
          </div>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount (PLN)</TableHead>
              <TableHead>Amount (INR)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.plnAmount.toFixed(2)} PLN</TableCell>
                <TableCell>{entry.inrAmount.toFixed(2)} INR</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const updatedEntries = entries.filter(e => e.id !== entry.id);
                      setEntries(updatedEntries);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}