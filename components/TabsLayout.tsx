"use client";

import { useState } from "react";
import Changelog from "./Changelog";
import LogDetailModal from "./LogDetailModal";
import type { Agent, LogEntry } from "@/types";
import AgentDashboard from "./AgentDashboard";

interface TabsLayoutProps {
  initialAgents: Agent[];
  initialChangelog: LogEntry[];
}

export default function TabsLayout({
  initialAgents,
  initialChangelog,
}: TabsLayoutProps) {
  const [activeTab, setActiveTab] = useState<"agents" | "changelog">("agents");
  const [isLogDetailModalOpen, setIsLogDetailModalOpen] = useState(false);
  const [selectedLogEntry, setSelectedLogEntry] = useState<LogEntry | null>(
    null
  );

  const handleViewLogDetails = (log: LogEntry) => {
    setSelectedLogEntry(log);
    setIsLogDetailModalOpen(true);
  };

  const handleCloseLogDetailModal = () => {
    setIsLogDetailModalOpen(false);
    setSelectedLogEntry(null);
  };

  return (
    <>
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("agents")}
            className={`pb-4 px-2 text-lg font-medium transition-colors ${
              activeTab === "agents"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Centro de Agentes
          </button>
          <button
            onClick={() => setActiveTab("changelog")}
            className={`pb-4 px-2 text-lg font-medium transition-colors ${
              activeTab === "changelog"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Log de Cambios
          </button>
        </nav>
      </div>

      {/* ✅ Conditional rendering controlado */}
      {activeTab === "agents" ? (
        <AgentDashboard initialAgents={initialAgents} />
      ) : (
        <Changelog
          logs={initialChangelog}
          onViewDetails={handleViewLogDetails}
        />
      )}

      <LogDetailModal
        isOpen={isLogDetailModalOpen}
        onClose={handleCloseLogDetailModal}
        logEntry={selectedLogEntry}
      />
    </>
  );
}
