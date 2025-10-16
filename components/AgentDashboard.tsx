import { useState } from "react";

import { Agent } from "@/types";
import AgentList from "./AgentList";
import { PlusIcon } from "./icons";
import Modal from "./Modal";
import AgentForm from "./AgentForm";

const AgentDashboard = ({ initialAgents }: { initialAgents: Agent[] }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleSaveNew = async (newAgent: Agent | Omit<Agent, 'id'>) => {
    console.log('Create:: ', newAgent);
    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAgent),
    });
    const data = await response.json();
    console.log('Created Agent:', data);
    setAgents((prev) => [...prev, data]);
    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = async (newAgent: Agent | Omit<Agent, 'id'>) => {
    console.log('Edit:: ', newAgent);
    if (!('id' in newAgent)) return;

    const response = await fetch(`/api/agent/${newAgent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAgent),
    });
    const data = await response.json();
    console.log('Updated Agent:', data);

    setAgents((prev) =>
      prev.map((agent) => (agent.id === data.id ? data : agent))
    );

    setIsEditModalOpen(false);
    setSelectedAgent(null);
  };

  const onCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (agent: Agent) => {
    setIsEditModalOpen(true);
    setSelectedAgent(agent);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAgent(null);
  };

  const handleDelete = (agent: Agent) => {
    console.log("Delete", agent.id);
    // Aquí puedes agregar la lógica para eliminar el agente
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full">
      <div className="sticky top-24 z-10 bg-white px-6 pt-6 pb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-gray-600">Todos los agentes</h2>
          <button
            onClick={onCreate}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Crear Nuevo Agente
          </button>
        </div>
      </div>
      <AgentList agents={agents} onEdit={handleEdit} onDelete={handleDelete} />
      {/* Modal de Creacion de Agente */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Agente"
      >
        <AgentForm
          agentToEdit={null}
          onSave={handleSaveNew}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
      {/* Modal de editar Agente */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Agente"
      >
        <AgentForm
          agentToEdit={selectedAgent}
          onSave={handleSaveEdit}
          onCancel={handleCloseEditModal}
        />
      </Modal>
    </div>
  );
};

export default AgentDashboard;
