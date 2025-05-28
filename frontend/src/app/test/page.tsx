"use client";

import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard" role="Gudang">
      <div className="flex items-center justify-center h-48 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
        <p className="text-2xl text-gray-400 dark:text-gray-500">
          
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
          <p className="text-2xl text-gray-400 dark:text-gray-500">
            
          </p>
        </div>
        <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
          <p className="text-2xl text-gray-400 dark:text-gray-500">
           
          </p>
        </div>
        <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
          <p className="text-2xl text-gray-400 dark:text-gray-500">
            
          </p>
        </div>
        <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
          <p className="text-2xl text-gray-400 dark:text-gray-500">
            
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
