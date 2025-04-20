"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AddStudentModal from "@/components/AddStudentModal";
import DashboardLayout from "@/components/DashboardLayout";

interface Student {
  _id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  created_at: string;
}

export default function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    studentData: Omit<Student, "_id" | "created_at">
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students</h1>
          <Button onClick={() => setIsModalOpen(true)}>Add Student</Button>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#025DFF]"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-400">No students added yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Click the "Add Student" button to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-gray-900/50 p-4 rounded-lg border border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-gray-400">{student.email}</p>
                    <p className="text-sm text-gray-400">{student.phone}</p>
                    <p className="text-sm text-gray-400">
                      DOB: {new Date(student.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddStudentModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddStudent={handleAddStudent}
        />
      </div>
    </DashboardLayout>
  );
}
