import Header from "@/components/Header";
import TabsLayout from "@/components/TabsLayout";
import { apiAgents } from "@/lib/api/agents";
import { useAgents } from "@/lib/hools/useAgents";
import { LogEntry } from "@/types";

const initialChangelog: LogEntry[] = [
  {
    id: "log1",
    user: "Ruben Omar Eroza",
    agentName: "Custom & Trade",
    action: "editado",
    details: "Se modificó: master prompt, temperatura a 0.7.",
    timestamp: new Date("2024-07-29T10:30:00Z"),
    previousState: {
      name: "Custom & Trade",
      customPrompt: "You are an expert in customs and trade regulations.",
      temperature: 0.8,
    },
    currentState: {
      name: "Custom & Trade",
      customPrompt:
        "You are a world-class expert in global customs and trade regulations, providing precise and actionable advice.",
      temperature: 0.7,
    },
  },
  {
    id: "log2",
    user: "Jane Smith",
    agentName: "Bank",
    action: "editado",
    details: "Se modificó: descripción.",
    timestamp: new Date("2024-07-29T09:15:00Z"),
    previousState: {
      name: "Bank",
      description: "Agent specialized in banking and finance.",
    },
    currentState: {
      name: "Bank",
      description:
        "Agent specialized in banking, finance, and investment strategies.",
    },
  },
  {
    id: "log3",
    user: "Ruben Omar Eroza",
    agentName: "Travel",
    action: "creado",
    details: "Agente creado exitosamente.",
    timestamp: new Date("2024-07-28T16:45:00Z"),
    previousState: null,
    currentState: undefined,
  },
];

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Header />

      <main className="px-8 py-4">
        <TabsLayout
          initialChangelog={initialChangelog}
        />
      </main>
    </div>
  );
}
