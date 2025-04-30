import { PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from './button';
import { cn } from '@app/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent } from './popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Calendar } from './calendar';
import { useState } from 'react';
import { format } from 'date-fns';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export const DatePicker = ({ date, setDate, className }: DatePickerProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const [calendarDate, setCalendarDate] = useState<Date>(date || new Date());

  const handleYearSelect = (year: string) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(Number.parseInt(year));
    setCalendarDate(newDate);
  };

  const handleMonthSelect = (month: string) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(Number.parseInt(month));
    setCalendarDate(newDate);
  };

  const months = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick your date of birth</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <div className="border-border flex gap-2 border-b p-3">
          <Select value={calendarDate.getMonth().toString()} onValueChange={handleMonthSelect}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={calendarDate.getFullYear().toString()} onValueChange={handleYearSelect}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={calendarDate}
          onMonthChange={setCalendarDate}
          defaultMonth={date || new Date(currentYear - 18, 0, 1)} // Default to 18 years ago
          disabled={(date) => {
            return date > new Date() || date < new Date(currentYear - 100, 0, 1);
          }}
          initialFocus
          className="flex justify-center"
        />
      </PopoverContent>
    </Popover>
  );
};
