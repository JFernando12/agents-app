import React, { useState, useEffect } from "react";
import type { Agent, IconName } from "@/types";
import AgentChat from "./AgentChat";
import { Loader2 } from "lucide-react";
import AgentFormGeneral from "./AgentFormGeneral";
import AgentFormSources from "./AgentFormSources";
import AgentFormIntegration from "./AgentFormIntegration";

interface AgentFormProps {
  agentToEdit: Agent | null;
  onSave: (agent: Omit<Agent, "id"> | Agent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AgentForm: React.FC<AgentFormProps> = ({
  agentToEdit,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [agentData, setAgentData] = useState<Omit<Agent, "id">>({
    name: "",
    description: "",
    icon: "Default",
    customPrompt: "",
    model: "gemini-2.5-flash",
    temperature: 0.8,
    topK: 50,
    topP: 1,
    maxTokens: 2000,
  });

  const [activeTab, setActiveTab] = useState<
    "general" | "fuentes" | "integracion"
  >("general");

  useEffect(() => {
    if (agentToEdit) {
      setAgentData(agentToEdit);
    } else {
      setAgentData({
        name: "",
        description: "",
        icon: "Default",
        customPrompt: "",
        model: "claude-4.5-sonnet",
        temperature: 0.8,
        topK: 50,
        topP: 1,
        maxTokens: 2000,
      });
    }
  }, [agentToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const isNumberField = ["temperature", "topK", "topP", "maxTokens"].includes(
      name
    );

    console.log("Name:", name, "Value:", value);

    setAgentData((prev) => ({
      ...prev,
      [name]: isNumberField ? Number(value) : value,
    }));
  };

  const handleIconSelect = (iconName: IconName) => {
    setAgentData((prev) => ({ ...prev, icon: iconName }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentToEdit) {
      onSave({ ...agentData, id: agentToEdit.id });
    } else {
      onSave(agentData);
    }
  };

  return (
    <div className="flex flex-row gap-3 h-[80vh] w-full max-w-6xl">
      {/* Configuracion */}
      <div className="flex flex-col min-h-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full w-3xl">
          {agentToEdit && (
            <div className="flex-shrink-0 flex space-x-2 mb-2 border-b pb-2">
              {(['general', 'fuentes', 'integracion'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-[#232A37] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab === 'fuentes'
                    ? 'Fuentes'
                    : tab === 'integracion'
                    ? 'Integración'
                    : 'General'}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="flex-1 overflow-y-auto mb-4 pr-4 custom-scrollbar min-h-0">
              <AgentFormGeneral
                agent={agentData}
                handleChange={handleChange}
                handleIconSelect={handleIconSelect}
              />
            </div>
          )}
          {activeTab === 'fuentes' && <AgentFormSources agent={agentToEdit} />}

          {activeTab === 'integracion' && (
            <div className="flex-1 overflow-y-auto mb-4 pr-4 custom-scrollbar min-h-0">
              <AgentFormIntegration />)
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 w-full flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
      {/* Agente Chat */}
      {agentToEdit && (
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col min-h-0">
          <AgentChat agent={agentData} />
        </div>
      )}
    </div>
  );
};

export default AgentForm;
