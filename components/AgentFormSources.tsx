import { useEffect, useMemo, useRef, useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon, UploadIcon } from "./icons";
import { Agent, Fuente } from "@/types";
import { apiDocuments } from "@/lib/api/documents";



interface AgentFormSourcesProps {
  agent: Agent | null;
}

const AgentFormSources = ({ agent }: AgentFormSourcesProps) => {
  const [selectedFuenteId, setSelectedFuenteId] = useState<number | null>(null);
  const [fuentes, setFuentes] = useState<Fuente[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedFuente = useMemo(() => {
    return fuentes.find((f) => f.id === selectedFuenteId) || null;
  }, [selectedFuenteId, fuentes]);

  useEffect(() => {

    const getDocuments = async () => {
      if (!agent) return;
      const documents = await apiDocuments.getDocuments(agent.id);
      console.log("Fetched documents:", documents);
      setFuentes(documents);
    };

    getDocuments();
  }, [agent]);

  const handleToggleFuente = (id: number) => {
    setFuentes(
      fuentes.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!agent?.id) return;
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    console.log("Selected file:", file);

    await apiDocuments.uploadDocument({ serviceId: agent.id, file })
  };

  const renderFuenteItem = (fuente: Fuente) => (
    <div
      key={fuente.id.toString()}
      onClick={() => setSelectedFuenteId(fuente.id)}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
        selectedFuenteId === fuente.id
          ? "bg-[#374151] text-white"
          : "hover:bg-[#2d3748]"
      }`}
    >
      <span className="truncate text-sm">{fuente.name}</span>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          type="button"
          className="p-1 hover:text-blue-400"
          onClick={(e) => e.stopPropagation()}
        >
          <EyeIcon className="w-4 h-4" />
        </button>
        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
          <button
            type="button"
            onClick={() => handleToggleFuente(fuente.id)}
            className={`${
              fuente.active ? "bg-blue-600" : "bg-gray-600"
            } relative inline-flex items-center h-4 rounded-full w-8 transition-colors`}
          >
            <span
              className={`${
                fuente.active ? "translate-x-5" : "translate-x-1"
              } inline-block w-3 h-3 transform bg-white rounded-full transition-transform`}
            />
          </button>
        </div>
        <button
          type="button"
          className="p-1 hover:text-red-500"
          onClick={(e) => e.stopPropagation()}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow flex gap-4">
        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-[#232A37] text-white p-3 rounded-lg">
            <h4 className="font-bold text-md mb-2">Documentos</h4>
            <div className="space-y-1">{fuentes.map(renderFuenteItem)}</div>
          </div>
        </div>
        <div className="w-1/2 flex h-full">
          <div
            className="w-full h-full bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="font-semibold text-gray-600">
              Cargar nuevo documento:
            </p>
            <p className="text-sm text-gray-500">
              Coloca aquí el archivo o da clic para buscarlo
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {selectedFuente && (
        <div className="mt-4 bg-[#F4F5FA] rounded-lg p-4 w-full flex-shrink-0 relative">
          <button
            type="button"
            className="absolute top-4 right-4 flex items-center space-x-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <h4 className="font-bold text-lg text-gray-800 mb-3">
            Detalles de la Fuente
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <p className="font-semibold text-gray-600">Nombre:</p>
              <p className="text-gray-800">{selectedFuente.name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">
                Última actualización:
              </p>
              <p className="text-gray-800">{selectedFuente.lastUpdated}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">Medio de obtención:</p>
              <p className="text-gray-800">{selectedFuente.medio}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-600">
                Link de publicación:
              </p>
              <a
                href={selectedFuente.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                {selectedFuente.link}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentFormSources;
