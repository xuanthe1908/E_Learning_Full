import React, { useState } from "react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import BlockedStudents from "./blocked-students";
import ViewStudents from "./view-students";

type TabValue = "all" | "blocked";

const TABS: { label: string; value: TabValue; icon: React.ElementType }[] = [
  { label: "All students", value: "all", icon: Square3Stack3DIcon },
  { label: "Blocked", value: "blocked", icon: UserCircleIcon },
];

export default function StudentsTab() {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  return (
    <div className="p-0.5">
      <div className="mx-3.5 flex gap-1 rounded-lg bg-blue-gray-50 p-1">
        {TABS.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === value
                ? "bg-white text-blue-gray-900 shadow-sm"
                : "text-blue-gray-600 hover:text-blue-gray-900"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </div>

      <div className="pt-5">
        {activeTab === "all" ? <ViewStudents /> : <BlockedStudents />}
      </div>
    </div>
  );
}
