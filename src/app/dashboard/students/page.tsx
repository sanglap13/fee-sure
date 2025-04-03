"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Students() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.2] tracking-tighter text-gradient geist-sans mb-8">
          Students
        </h2>
        <div className="card p-6">
          <p className="text-gray-400 geist-mono">
            No students added yet. Add your first student to get started.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
