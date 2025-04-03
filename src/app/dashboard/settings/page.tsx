"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.2] tracking-tighter text-gradient geist-sans mb-8">
          Settings
        </h2>
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4 geist-sans">
            Account Settings
          </h3>
          <p className="text-gray-400 geist-mono mb-6">
            Manage your account settings and preferences.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <h4 className="font-medium geist-sans">Email Notifications</h4>
                <p className="text-sm text-gray-400 geist-mono">
                  Receive email notifications for payments
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#025DFF]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <h4 className="font-medium geist-sans">Dark Mode</h4>
                <p className="text-sm text-gray-400 geist-mono">
                  Toggle dark mode (already enabled)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked
                  readOnly
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#025DFF]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
