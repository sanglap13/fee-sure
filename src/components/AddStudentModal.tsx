"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Student {
  _id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  created_at: string;
}

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onAddStudent: (student: Omit<Student, "_id" | "created_at">) => Promise<void>;
}

export default function AddStudentModal({
  open,
  onClose,
  onAddStudent,
}: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onAddStudent(formData);
      setFormData({ name: "", email: "", phone: "", dob: "" });
    } catch (error) {
      setError("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Student
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-red-900/50 text-red-200 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-300">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter student name"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter student email"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-zinc-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter phone number"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob" className="text-zinc-300">
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                required
                className="bg-zinc-800 border-zinc-700 text-white"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
