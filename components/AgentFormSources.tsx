import { useMemo, useRef, useState } from 'react';
import { EyeIcon, PencilIcon, TrashIcon, UploadIcon } from './icons';
import { Agent, Fuente } from '@/types';
import { useDocuments, useUploadDocument } from '@/lib/hools/useDocuments';

interface AgentFormSourcesProps {
  agent: Agent | null;
}

const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const formControlClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#232A37] text-gray-700';

const AgentFormSources = ({ agent }: AgentFormSourcesProps) => {
  const [activeTab, setActiveTab] = useState<'subir' | 'detalle'>('subir');
  const [selectedFuenteId, setSelectedFuenteId] = useState<number | null>(null);
  const [newFileData, setNewFileData] = useState<{
    file: File;
    name: string;
    category: 'oficial' | 'interno';
    medio: string;
    link: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: documents } = useDocuments({ serviceId: agent?.id });
  const uploadDocument = useUploadDocument();

  const selectedFuente = useMemo(() => {
    return documents?.find((f) => f.id === selectedFuenteId) || null;
  }, [selectedFuenteId, documents]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!agent?.id) return;
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setNewFileData({
      file,
      name: file.name,
      category: 'oficial',
      medio: '',
      link: '',
    });
  };

  const handleSaveNewFuente = async () => {
    if (!agent?.id || !newFileData) return;
    await uploadDocument.mutateAsync({
      serviceId: agent.id,
      data: {
        file: newFileData.file,
        name: newFileData.name,
        category: newFileData.category,
        medio: newFileData.medio,
        link: newFileData.link,
      },
    });
    setNewFileData(null);
  };

  const handleSelectFuente = (fuenteId: number) => {
    setSelectedFuenteId(fuenteId);
    setActiveTab('detalle');
  };

  const renderFuenteItem = (fuente: Fuente) => (
    <div
      key={fuente.id.toString()}
      onClick={() => handleSelectFuente(fuente.id)}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
        selectedFuenteId === fuente.id
          ? 'bg-[#374151] text-white'
          : 'hover:bg-[#2d3748]'
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
            className={`${
              fuente.active ? 'bg-blue-600' : 'bg-gray-600'
            } relative inline-flex items-center h-4 rounded-full w-8 transition-colors`}
          >
            <span
              className={`${
                fuente.active ? 'translate-x-5' : 'translate-x-1'
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
    <div className="flex-1 mb-4 pr-4 min-h-0 flex flex-col h-full overflow-hidden">
      <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
        <div className="w-1/2 flex flex-col min-h-0 h-full overflow-hidden">
          <div className="bg-[#232A37] text-white p-3 rounded-lg flex flex-col flex-1 min-h-0 h-full overflow-hidden">
            <h4 className="font-bold text-md mb-2">Documentos</h4>
            <div className="space-y-1 overflow-y-auto flex-1 min-h-0 pr-1">
              {documents?.map(renderFuenteItem)}
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col min-h-0 h-full overflow-hidden">
          <div className="gap-2 pb-2 flex">
            <button
              type="button"
              onClick={() => setActiveTab('subir')}
              className={`pb-1 px-2 text-sm font-medium transition-colors ${
                activeTab === 'subir'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Subir Documento
            </button>
            {selectedFuente && (
              <button
                type="button"
                onClick={() => setActiveTab('detalle')}
                className={`pb-1 px-2 text-sm font-medium transition-colors ${
                  activeTab === 'detalle'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Detalle de la Fuente
              </button>
            )}
          </div>

          {/* Cargar Nuevo Documento */}
          {!newFileData && activeTab === 'subir' && (
            <div>
              <div
                className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-gray-400 transition-colors"
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
          )}

          {/* Formulario Nuevo Documento */}
          {newFileData && activeTab === 'subir' && (
            <div className="flex justify-center items-center border border-gray-300 rounded-lg w-full">
              <div className="bg-white rounded-lg p-4 w-full">
                <div className="space-y-3 w-full">
                  <div>
                    <label className={labelClass}>Nombre del archivo</label>
                    <input
                      type="text"
                      value={newFileData.name}
                      className="w-full bg-gray-100 p-2 rounded border border-gray-300 text-gray-700"
                      onChange={(e) =>
                        setNewFileData((d) =>
                          d ? { ...d, name: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Categoría</label>
                    <div className="flex space-x-4">
                      <label>
                        <input
                          type="radio"
                          name="category"
                          value="oficial"
                          checked={newFileData.category === 'oficial'}
                          onChange={(e) =>
                            setNewFileData((d) =>
                              d
                                ? { ...d, category: e.target.value as any }
                                : null
                            )
                          }
                          className="mr-1"
                        />
                        <p className="inline text-gray-700">Oficial</p>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="category"
                          value="interno"
                          checked={newFileData.category === 'interno'}
                          onChange={(e) =>
                            setNewFileData((d) =>
                              d
                                ? { ...d, category: e.target.value as any }
                                : null
                            )
                          }
                          className="mr-1"
                        />
                        <p className="inline text-gray-700">Interno</p>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Medio de obtención</label>
                    <input
                      type="text"
                      value={newFileData.medio}
                      onChange={(e) =>
                        setNewFileData((d) =>
                          d ? { ...d, medio: e.target.value } : null
                        )
                      }
                      className={formControlClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Link de publicación</label>
                    <input
                      type="text"
                      value={newFileData.link}
                      onChange={(e) =>
                        setNewFileData((d) =>
                          d ? { ...d, link: e.target.value } : null
                        )
                      }
                      className={formControlClass}
                    />
                  </div>
                  <div className="flex justify-center space-x-2 pt-3">
                    <button
                      onClick={() => setNewFileData(null)}
                      className="px-4 py-2 bg-gray-200 rounded text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveNewFuente}
                      className="px-4 py-1 bg-green-600 text-white rounded"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detalles de la Fuente Seleccionada */}
          {selectedFuente && activeTab === 'detalle' && (
            <div className="bg-[#F4F5FA] rounded-lg p-4 w-full flex-shrink-0 relative">
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
                  <p className="font-semibold text-gray-600">
                    Medio de obtención:
                  </p>
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
      </div>
    </div>
  );
};

export default AgentFormSources;
