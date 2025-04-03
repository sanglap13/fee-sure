"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.2] tracking-tighter text-gradient geist-sans mb-8">
          Welcome to your Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4 geist-sans">
              Total Students
            </h3>
            <p className="text-4xl font-bold text-[#025DFF] geist-mono">0</p>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4 geist-sans">
              Pending Fees
            </h3>
            <p className="text-4xl font-bold text-red-500 geist-mono">0</p>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-4 geist-sans">
              Paid This Month
            </h3>
            <p className="text-4xl font-bold text-green-500 geist-mono">0</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
