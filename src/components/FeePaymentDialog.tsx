import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (month: string, date: Date) => void;
  lastPaidMonth: string | null;
  studentName: string;
  selectedStudent: any;
}

export default function FeePaymentDialog({
  open,
  onClose,
  onSend,
  lastPaidMonth,
  studentName,
  selectedStudent,
}: FeePaymentDialogProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (lastPaidMonth) {
      const lastPaidIndex = months.indexOf(lastPaidMonth);
      const nextMonthIndex = (lastPaidIndex + 1) % 12;
      setSelectedMonth(months[nextMonthIndex]);
    } else {
      setSelectedMonth(months[new Date().getMonth()]);
    }
  }, [lastPaidMonth]);

  const handleSend = () => {
    onSend(selectedMonth, selectedDate);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-200">
            Fee Payment for {studentName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label
              htmlFor="month"
              className="text-sm font-medium text-gray-300"
            >
              Fee Month
            </label>
            <input
              type="text"
              value={
                selectedStudent?.isLate && selectedStudent.isLate.length > 0
                  ? selectedStudent.isLate[0]
                  : months[new Date().getMonth()]
              }
              readOnly
              className="bg-gray-800 border border-gray-700 text-gray-200 rounded-md px-3 py-2 cursor-not-allowed"
              tabIndex={-1}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium text-gray-300">
              Payment Date
            </label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border border-gray-700 bg-gray-800 p-2"
                disabled={{ after: new Date() }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="bg-[#025DFF] text-white hover:bg-[#025DFF]/90"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
