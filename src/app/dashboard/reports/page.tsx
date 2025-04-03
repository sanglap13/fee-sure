"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.2] tracking-tighter text-gradient geist-sans mb-8">
          Reports
        </h2>
        <div className="card p-6">
          <p className="text-gray-400 geist-mono">
            No reports available yet. Reports will be generated as you collect
            payment data.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
