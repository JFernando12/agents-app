import React, { useState, useEffect } from 'react';
import type { Agent, IconName } from '@/types';
import AgentChat from './AgentChat';
import { ApiIcon, CopyIcon } from './icons';
import AgentFormGeneral from './AgentFormGeneral';
import AgentFormSources from './AgentFormSources';
import AgentFormIntegration from './AgentFormIntegration';

interface AgentFormProps {
  agentToEdit: Agent | null;
  onSave: (agent: Omit<Agent, 'id'> | Agent) => void;
  onCancel: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({
  agentToEdit,
  onSave,
  onCancel,
}) => {
  const [agentData, setAgentData] = useState<Omit<Agent, 'id'>>({
    name: '',
    description: '',
    icon: 'Default',
    customPrompt: '',
    model: 'gemini-2.5-flash',
    temperature: 0.8,
    topK: 50,
    topP: 1,
    maxTokens: 2000,
  });

  const [activeTab, setActiveTab] = useState<
    'general' | 'fuentes' | 'integracion'
  >('general');

  useEffect(() => {
    if (agentToEdit) {
      setAgentData(agentToEdit);
    } else {
      setAgentData({
        name: '',
        description: '',
        icon: 'Default',
        customPrompt: '',
        model: 'claude-4.5-sonnet',
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
    const isNumberField = ['temperature', 'topK', 'topP', 'maxTokens'].includes(
      name
    );

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
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-0">
      <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex-shrink-0 flex space-x-2 mb-4 border-b pb-4">
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

          <div className="mb-4">
            {activeTab === 'general' && (
              <AgentFormGeneral
                agent={agentData}
                handleChange={handleChange}
                handleIconSelect={handleIconSelect}
              />
            )}
            {activeTab === 'fuentes' && (
              <AgentFormSources agent={agentToEdit} />
            )}
            {activeTab === 'integracion' && <AgentFormIntegration />}
          </div>

          <div className="flex-shrink-0 pt-4 border-t border-gray-200 w-full flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
      <div className="w-full md:w-1/3 lg:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 flex flex-col">
        <AgentChat agent={agentData} />
      </div>
    </div>
  );
};

export default AgentForm;
