import type { Agent } from "@/types";
import AgentCard from "./AgentCard";

interface AgentListProps {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
}

const AgentList = ({ agents, onEdit, onDelete }: AgentListProps) => {
  return (
    <div className="px-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent: Agent) => (
          <AgentCard key={agent.id} agent={agent} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default AgentList;
