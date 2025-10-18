import { useState } from 'react';
import { ApiIcon, CopyIcon } from './icons';

interface AgentFormIntegrationProps {
  agentId?: string;
}

const AgentFormIntegration = ({ agentId }: AgentFormIntegrationProps) => {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const requestExample = JSON.stringify(
    {
      message: 'Explicame en que consiste el Dashboard',
      username: 'user1',
      service_id: agentId,
    },
    null,
    2
  );

  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/conversation`;

  return (
    <div className="space-y-6 text-gray-800 max-w-4xl">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-4">
        <ApiIcon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-bold text-blue-800">
            Integración de API
          </h3>
          <p className="text-blue-700 text-sm">
            Integra este servicio en tus aplicaciones usando nuestra API REST.
            Envía preguntas y recibe respuestas potenciadas por IA basadas en
            los documentos subidos a este servicio.
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">Endpoint de la API</h4>
          <button
            type="button"
            onClick={() => handleCopy('endpoint', endpoint)}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <CopyIcon className="w-4 h-4" />
            <span>{copiedStates['endpoint'] ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <div className="bg-[#232A37] text-white rounded-lg p-4 font-mono text-sm">
          <span className="text-green-400 font-bold mr-4">POST</span>
          <span>{endpoint}</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">Request Example</h4>
          <button
            type="button"
            onClick={() => handleCopy('request', requestExample)}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <CopyIcon className="w-4 h-4" />
            <span>{copiedStates['request'] ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <pre className="bg-[#232A37] text-white rounded-lg p-4 text-sm whitespace-pre-wrap">
          <code>{requestExample}</code>
        </pre>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2">Parameters</h4>
        <div className="bg-gray-50 rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 font-medium text-gray-600">PARAMETER</th>
                <th className="p-3 font-medium text-gray-600">TYPE</th>
                <th className="p-3 font-medium text-gray-600">REQUIRED</th>
                <th className="p-3 font-medium text-gray-600">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="bg-white">
                <td className="p-3 font-mono">message</td>
                <td className="p-3">string</td>
                <td className="p-3 text-green-600 font-semibold">Yes</td>
                <td className="p-3">
                  The question or prompt to send to the AI
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-mono">username</td>
                <td className="p-3">string</td>
                <td className="p-3 text-green-600 font-semibold">Yes</td>
                <td className="p-3">
                  Identifier for the user making the request
                </td>
              </tr>
              <tr className="bg-white">
                <td className="p-3 font-mono">service_id</td>
                <td className="p-3">string</td>
                <td className="p-3 text-green-600 font-semibold">Yes</td>
                <td className="p-3">
                  The ID of this service (automatically filled)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentFormIntegration;
