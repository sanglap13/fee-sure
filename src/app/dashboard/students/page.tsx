"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AddStudentModal from "@/components/AddStudentModal";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { Mail, X, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeePaymentDialog from "@/components/FeePaymentDialog";

interface Student {
  _id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  createdAt: string;
  isActive: boolean;
  isLate: string[] | null;
  feePaid: string[];
}

type StatusFilter = "active" | "inactive" | "all";

export default function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeePaymentOpen, setIsFeePaymentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log("Fetching students...");
      const response = await fetch("/api/students");
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response data:", errorData);
        throw new Error(
          `Failed to fetch students: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Students data:", data);
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (
    studentData: Omit<Student, "_id" | "createdAt">
  ) => {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      const newStudent = await response.json();
      setStudents((prev) => [newStudent, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding student:", error);
      setError("Failed to add student");
    }
  };

  const handleStatusChange = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update student status");
      }

      setStudents((prev) =>
        prev.map((student) =>
          student._id === id ? { ...student, isActive } : student
        )
      );
    } catch (error) {
      console.error("Error updating student status:", error);
      setError("Failed to update student status");
    }
  };

  const handleFeePayment = async (student: Student) => {
    setSelectedStudent(student);
    setIsFeePaymentOpen(true);
  };

  const handleSendFeePayment = async (month: string, date: Date) => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(`/api/students/${selectedStudent._id}/fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month,
          date: date.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update fee payment");
      }

      const updatedStudent = await response.json();
      setStudents((prev) =>
        prev.map((student) =>
          student._id === updatedStudent._id ? updatedStudent : student
        )
      );
      console.log("Fee payment recorded for month:", month);
    } catch (error) {
      console.error("Error updating fee payment:", error);
      setError("Failed to update fee payment");
    }
  };

  const getFilteredStudents = () => {
    if (statusFilter === "all") return students;
    return students.filter((student) =>
      statusFilter === "active" ? student.isActive : !student.isActive
    );
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Date of Birth",
      accessor: "dob",
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Joined At",
      accessor: "createdAt",
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Fee Status",
      accessor: "isLate",
      cell: (value: string[] | null, row: Student) => {
        if (!value || value.length === 0) return "Up to date";
        return `Due: ${value.join(", ")}`;
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (_: any, row: Student) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleFeePayment(row)}
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleStatusChange(row._id, !row.isActive)}
          >
            {row.isActive ? (
              <X className="h-4 w-4 text-red-500" />
            ) : (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.2] tracking-tighter text-gradient geist-sans">
            Students
          </h2>
          <div className="flex gap-4 items-center">
            <Select
              value={statusFilter}
              onValueChange={(value: StatusFilter) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer"
            >
              Add Student
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#025DFF]"></div>
          </div>
        ) : getFilteredStudents().length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-400">No students found.</p>
            <p className="text-gray-500 text-sm mt-2">
              {statusFilter !== "all"
                ? `No ${statusFilter} students. Try changing the filter.`
                : "Click the 'Add Student' button to get started."}
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={getFilteredStudents()}
            onStatusChange={handleStatusChange}
          />
        )}

        <AddStudentModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddStudent={handleAddStudent}
        />

        <FeePaymentDialog
          open={isFeePaymentOpen}
          onClose={() => setIsFeePaymentOpen(false)}
          onSend={handleSendFeePayment}
          lastPaidMonth={
            selectedStudent?.feePaid[selectedStudent.feePaid.length - 1] || null
          }
          studentName={selectedStudent?.name || ""}
          selectedStudent={selectedStudent}
        />
      </div>
    </DashboardLayout>
  );
}
