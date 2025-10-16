import { Agent, IconName } from '@/types';
import { AgentIcon } from './AgentIcon';
import { CpaVisionIconBlack } from './icons';

const iconNames: IconName[] = [
  'CustomTrade',
  'Bank',
  'Convertion',
  'FacReview',
  'NomReview',
  'Inbox',
  'Respond',
  'Risk',
  'CPATax',
  'Travel',
  'Process',
  'Default',
  'CPAMember',
];
const modelOptions = [
  'claude-4.5-sonnet',
  'claude-4-sonnet',
  'claude-3.7-sonnet',
  'claude-3.5-haiku',
];

interface AgentFormGeneralProps {
  agent: Omit<Agent, 'id'>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleIconSelect: (icon: IconName) => void;
}

const AgentFormGeneral = ({
  agent,
  handleChange,
  handleIconSelect,
}: AgentFormGeneralProps) => {
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const formControlClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  focus:ring-[#232A37] text-gray-700';

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          Nombre del Agente
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={agent.name}
          onChange={handleChange}
          className={formControlClass}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={agent.description}
          onChange={handleChange}
          rows={2}
          className={formControlClass}
        ></textarea>
      </div>
      <div>
        <label className={labelClass}>Icono</label>
        <div className="grid grid-cols-6 gap-2 p-2 border border-gray-300 rounded-lg">
          {iconNames.map((icon) => (
            <button
              type="button"
              key={icon}
              onClick={() => handleIconSelect(icon)}
              className={`p-2 rounded-md flex justify-center items-center transition-colors ${
                agent.icon === icon
                  ? 'bg-[#232A37] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <AgentIcon name={icon} className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="masterPrompt"
            className="block text-sm font-medium text-gray-700"
          >
            Master Prompt (System Instruction)
          </label>
          <button
            type="button"
            disabled={!agent.customPrompt.trim()}
            className="flex items-center space-x-1 text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Mejorar con IA"
          >
            <CpaVisionIconBlack className="w-5 h-5 text-black" />
            <span className="text-xs font-semibold">{'Mejorar'}</span>
          </button>
        </div>
        <textarea
          id="masterPrompt"
          name="masterPrompt"
          value={agent.customPrompt}
          onChange={handleChange}
          rows={5}
          className={formControlClass}
        ></textarea>
      </div>
      <div>
        <label htmlFor="model" className={labelClass}>
          Modelo
        </label>
        <select
          id="model"
          name="model"
          value={agent.model}
          onChange={handleChange}
          className={`${formControlClass} bg-white`}
        >
          {modelOptions.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="temperature" className={labelClass}>
            Temperatura: {agent.temperature}
          </label>
          <input
            type="range"
            id="temperature"
            name="temperature"
            min="0"
            max="1"
            step="0.1"
            value={agent.temperature}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="topP" className={labelClass}>
            Top P: {agent.topP}
          </label>
          <input
            type="range"
            id="topP"
            name="topP"
            min="0"
            max="1"
            step="0.1"
            value={agent.topP}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="topK" className={labelClass}>
            Top K
          </label>
          <input
            type="number"
            id="topK"
            name="topK"
            value={agent.topK}
            onChange={handleChange}
            className={formControlClass}
          />
        </div>
        <div>
          <label htmlFor="maxTokens" className={labelClass}>
            Max Tokens
          </label>
          <input
            type="number"
            id="maxTokens"
            name="maxTokens"
            value={agent.maxTokens}
            onChange={handleChange}
            className={formControlClass}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentFormGeneral;
