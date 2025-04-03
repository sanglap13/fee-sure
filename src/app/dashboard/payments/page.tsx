"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Payments() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.2] tracking-tighter text-gradient geist-sans mb-8">
          Payments
        </h2>
        <div className="card p-6">
          <p className="text-gray-400 geist-mono">
            No payment records yet. Payments will appear here once students make
            payments.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
