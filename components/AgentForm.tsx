import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Agent, IconName } from '@/types';
import { AgentIcon } from './AgentIcon';
import AgentChat from './AgentChat';
// import { GoogleGenAI } from "@google/genai";
// Fix: Import TrashIcon to resolve reference error.
import { EyeIcon, UploadIcon, PencilIcon, ApiIcon, CopyIcon, TrashIcon, CpaVisionIconBlack } from './icons';

const iconNames: IconName[] = ['CustomTrade', 'Bank', 'Convertion', 'FacReview', 'NomReview', 'Inbox', 'Respond', 'Risk', 'CPATax', 'Travel', 'Process', 'Default', 'CPAMember'];
const modelOptions = ['claude-4.5-sonnet', 'claude-4-sonnet', 'claude-3.7-sonnet', 'claude-3.5-haiku'];

interface AgentFormProps {
    agentToEdit: Agent | null;
    onSave: (agent: Omit<Agent, 'id'> | Agent) => void
    onCancel: () => void;
}

type Fuente = {
    id: number;
    name: string;
    category: 'oficial' | 'interno';
    active: boolean;
    lastUpdated: string;
    medio: string;
    link: string;
};

const initialFuentes: Fuente[] = [
    { id: 1, name: 'Ley_Aduanera.pdf', category: 'oficial', active: true, lastUpdated: '2023-10-26', medio: 'Diario Oficial de la Federación', link: 'http://example.com/ley_aduanera' },
    { id: 2, name: 'Reglamento_Importacion.pdf', category: 'oficial', active: false, lastUpdated: '2023-09-15', medio: 'Secretaría de Economía', link: 'http://example.com/reglamento' },
    { id: 3, name: 'Tigie.xml', category: 'interno', active: true, lastUpdated: '2023-11-01', medio: 'Sistema Interno', link: 'http://internal.example.com/tigie' },
    { id: 4, name: 'Listado de Funcionalidades.txt', category: 'interno', active: true, lastUpdated: '2023-10-30', medio: 'Documento de Proyecto', link: 'http://internal.example.com/features' },
    { id: 5, name: 'Normas_Oficiales.docx', category: 'oficial', active: true, lastUpdated: '2023-08-20', medio: 'Diario Oficial de la Federación', link: 'http://example.com/noms' },
];

const AgentForm: React.FC<AgentFormProps> = ({ agentToEdit, onSave, onCancel }) => {
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
    
    const [activeTab, setActiveTab] = useState<'general' | 'fuentes' | 'integracion'>('general');
    const [fuentes, setFuentes] = useState<Fuente[]>(initialFuentes);
    const [selectedFuenteId, setSelectedFuenteId] = useState<number | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newFileData, setNewFileData] = useState<{ name: string; category: 'oficial' | 'interno'; medio: string; link: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [isImproving, setIsImproving] = useState(false);
    
    const selectedFuente = useMemo(() => {
        return fuentes.find(f => f.id === selectedFuenteId) || null;
    }, [selectedFuenteId, fuentes]);

    const getDocuments = async (serviceId: string) => {
        const response = await fetch(`/api/documents?serviceId=${serviceId}`);
        const documents = await response.json();
        return documents;
    };

    useEffect(() => {
        if (agentToEdit) {
            setAgentData(agentToEdit);
            getDocuments(agentToEdit.id);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumberField = ['temperature', 'topK', 'topP', 'maxTokens'].includes(name);
        
        setAgentData(prev => ({
            ...prev,
            [name]: isNumberField ? Number(value) : value
        }));
    };
    
    const handleCopy = (key: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [key]: false }));
        }, 2000);
    };


    const handleIconSelect = (iconName: IconName) => {
        setAgentData(prev => ({ ...prev, icon: iconName }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (agentToEdit) {
            onSave({ ...agentData, id: agentToEdit.id });
        } else {
            onSave(agentData);
        }
    };
    
//     const handleImprovePrompt = async () => {
//         if (!agentData.masterPrompt.trim()) return;

//         setIsImproving(true);
//         try {
//             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
//             const modelPrompt = `You are an expert in creating effective system instructions (master prompts) for large language models. Take the following user-provided prompt and improve it. The new prompt should be clear, concise, well-structured, and guide the AI agent's behavior effectively. The output should be ONLY the improved prompt text, without any introductory phrases like 'Here is the improved prompt:'.

// User's prompt:
// "${agentData.masterPrompt}"`;

//             const response = await ai.models.generateContent({
//                 model: 'gemini-2.5-flash',
//                 contents: modelPrompt,
//             });

//             const improvedText = response.text.trim();
//             setAgentData(prev => ({ ...prev, masterPrompt: improvedText }));
//         } catch (error) {
//             console.error("Error improving prompt:", error);
//             // Optionally set an error state to show a message to the user
//         } finally {
//             setIsImproving(false);
//         }
//     };
    
    const handleToggleFuente = (id: number) => {
        setFuentes(fuentes.map(f => f.id === id ? { ...f, active: !f.active } : f));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewFileData({ name: file.name, category: 'oficial', medio: '', link: '' });
            setIsUploadModalOpen(true);
            e.target.value = ''; // Reset file input
        }
    };

    const handleSaveNewFuente = () => {
        if (newFileData) {
            const newFuente: Fuente = {
                id: Date.now(),
                ...newFileData,
                active: true,
                lastUpdated: new Date().toISOString().split('T')[0],
            };
            setFuentes([...fuentes, newFuente]);
            setIsUploadModalOpen(false);
            setNewFileData(null);
        }
    };


    const formControlClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  focus:ring-[#232A37] text-gray-700";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    
    const renderFuenteItem = (fuente: Fuente) => (
         <div
            key={fuente.id.toString()}
            onClick={() => setSelectedFuenteId(fuente.id)}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedFuenteId === fuente.id ? 'bg-[#374151] text-white' : 'hover:bg-[#2d3748]'}`}
        >
            <span className="truncate text-sm">{fuente.name}</span>
            <div className="flex items-center space-x-2 flex-shrink-0">
                <button type="button" className="p-1 hover:text-blue-400" onClick={(e) => e.stopPropagation()}><EyeIcon className="w-4 h-4" /></button>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                     <button
                        type="button"
                        onClick={() => handleToggleFuente(fuente.id)}
                        className={`${fuente.active ? 'bg-blue-600' : 'bg-gray-600'} relative inline-flex items-center h-4 rounded-full w-8 transition-colors`}
                      >
                        <span className={`${fuente.active ? 'translate-x-5' : 'translate-x-1'} inline-block w-3 h-3 transform bg-white rounded-full transition-transform`} />
                    </button>
                </div>
                <button type="button" className="p-1 hover:text-red-500" onClick={(e) => e.stopPropagation()}><TrashIcon className="w-4 h-4" /></button>
            </div>
        </div>
    );

    const renderGeneralTab = () => (
        <div className="space-y-4">
            <div>
                <label htmlFor="name" className={labelClass}>Nombre del Agente</label>
                <input type="text" id="name" name="name" value={agentData.name} onChange={handleChange} className={formControlClass} required />
            </div>
            <div>
                <label htmlFor="description" className={labelClass}>Descripción</label>
                <textarea id="description" name="description" value={agentData.description} onChange={handleChange} rows={2} className={formControlClass}></textarea>
            </div>
            <div>
                <label className={labelClass}>Icono</label>
                <div className="grid grid-cols-6 gap-2 p-2 border border-gray-300 rounded-lg">
                    {iconNames.map(icon => (
                        <button
                            type="button"
                            key={icon}
                            onClick={() => handleIconSelect(icon)}
                            className={`p-2 rounded-md flex justify-center items-center transition-colors ${agentData.icon === icon ? 'bg-[#232A37] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            <AgentIcon name={icon} className="w-6 h-6" />
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="masterPrompt" className="block text-sm font-medium text-gray-700">Master Prompt (System Instruction)</label>
                    <button
                        type="button"
                        disabled={isImproving || !agentData.customPrompt.trim()}
                        className="flex items-center space-x-1 text-gray-600 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                        title="Mejorar con IA"
                    >
                        <CpaVisionIconBlack className="w-5 h-5 text-black" />
                        <span className="text-xs font-semibold">{isImproving ? 'Mejorando...' : 'Mejorar'}</span>
                    </button>
                </div>
                <textarea
                    id="masterPrompt"
                    name="masterPrompt"
                    value={agentData.customPrompt}
                    onChange={handleChange}
                    rows={5}
                    className={formControlClass}
                ></textarea>
            </div>
            <div>
                <label htmlFor="model" className={labelClass}>Modelo</label>
                <select id="model" name="model" value={agentData.model} onChange={handleChange} className={`${formControlClass} bg-white`}>
                    {modelOptions.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="temperature" className={labelClass}>Temperatura: {agentData.temperature}</label>
                    <input type="range" id="temperature" name="temperature" min="0" max="1" step="0.1" value={agentData.temperature} onChange={handleChange} className="w-full" />
                </div>
                <div>
                    <label htmlFor="topP" className={labelClass}>Top P: {agentData.topP}</label>
                    <input type="range" id="topP" name="topP" min="0" max="1" step="0.1" value={agentData.topP} onChange={handleChange} className="w-full" />
                </div>
                <div>
                    <label htmlFor="topK" className={labelClass}>Top K</label>
                    <input type="number" id="topK" name="topK" value={agentData.topK} onChange={handleChange} className={formControlClass} />
                </div>
                <div>
                    <label htmlFor="maxTokens" className={labelClass}>Max Tokens</label>
                    <input type="number" id="maxTokens" name="maxTokens" value={agentData.maxTokens} onChange={handleChange} className={formControlClass} />
                </div>
            </div>
        </div>
    );
    
    const renderFuentesTab = () => (
        <div className="flex flex-col h-full">
            <div className="flex-grow flex gap-4">
                <div className="w-1/2 flex flex-col gap-4">
                    <div className="bg-[#232A37] text-white p-3 rounded-lg">
                        <h4 className="font-bold text-md mb-2">Documentos Oficiales</h4>
                        <div className="space-y-1">{fuentes.filter(f => f.category === 'oficial').map(renderFuenteItem)}</div>
                    </div>
                    <div className="bg-[#232A37] text-white p-3 rounded-lg">
                        <h4 className="font-bold text-md mb-2">Documentos Internos</h4>
                        <div className="space-y-1">{fuentes.filter(f => f.category === 'interno').map(renderFuenteItem)}</div>
                    </div>
                </div>
                <div className="w-1/2 flex h-full">
                    <div
                        className="w-full h-full bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="font-semibold text-gray-600">Cargar nuevo documento:</p>
                        <p className="text-sm text-gray-500">Coloca aquí el archivo o da clic para buscarlo</p>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>
            </div>

            {selectedFuente && (
                <div className="mt-4 bg-[#F4F5FA] rounded-lg p-4 w-full flex-shrink-0 relative">
                     <button type="button" className="absolute top-4 right-4 flex items-center space-x-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg">
                        <PencilIcon className="w-4 h-4" />
                        <span>Editar</span>
                    </button>
                    <h4 className="font-bold text-lg text-gray-800 mb-3">Detalles de la Fuente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div>
                            <p className="font-semibold text-gray-600">Nombre:</p>
                            <p className="text-gray-800">{selectedFuente.name}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-gray-600">Última actualización:</p>
                            <p className="text-gray-800">{selectedFuente.lastUpdated}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-600">Medio de obtención:</p>
                            <p className="text-gray-800">{selectedFuente.medio}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-600">Link de publicación:</p>
                            <a href={selectedFuente.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{selectedFuente.link}</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
     const renderIntegracionTab = () => {
        const requestExample = JSON.stringify({
            "question": "Explicame en que consiste el Dashboard",
            "username": "user1",
            "service_id": "00134dc1-3ba4-4957-a979-643d64dd7860"
        }, null, 2);

        const endpoint = "https://3v6r138fh0.execute-api.us-east-1.amazonaws.com/conversation";

        return (
            <div className="space-y-6 text-gray-800">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-4">
                    <ApiIcon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-xl font-bold text-blue-800">Integración de API</h3>
                        <p className="text-blue-700 text-sm">Integra este servicio en tus aplicaciones usando nuestra API REST. Envía preguntas y recibe respuestas potenciadas por IA basadas en los documentos subidos a este servicio.</p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold">Endpoint de la API</h4>
                        <button type="button" onClick={() => handleCopy('endpoint', endpoint)} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
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
                         <button type="button" onClick={() => handleCopy('request', requestExample)} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                             <CopyIcon className="w-4 h-4" />
                             <span>{copiedStates['request'] ? 'Copied!' : 'Copy'}</span>
                         </button>
                    </div>
                    <pre className="bg-[#232A37] text-white rounded-lg p-4 text-sm whitespace-pre-wrap"><code>{requestExample}</code></pre>
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
                                    <td className="p-3 font-mono">question</td>
                                    <td className="p-3">string</td>
                                    <td className="p-3 text-green-600 font-semibold">Yes</td>
                                    <td className="p-3">The question or prompt to send to the AI</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="p-3 font-mono">username</td>
                                    <td className="p-3">string</td>
                                    <td className="p-3 text-green-600 font-semibold">Yes</td>
                                    <td className="p-3">Identifier for the user making the request</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="p-3 font-mono">service_id</td>
                                    <td className="p-3">string</td>
                                    <td className="p-3 text-green-600 font-semibold">Yes</td>
                                    <td className="p-3">The ID of this service (automatically filled)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    };
    
    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-0">
            <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex-shrink-0 flex space-x-2 mb-4 border-b pb-4">
                        {(['general', 'fuentes', 'integracion'] as const).map(tab => (
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
                                {tab === 'fuentes' ? 'Fuentes' : tab === 'integracion' ? 'Integración' : 'General'}
                            </button>
                        ))}
                    </div>

                    <div className="mb-4">
                        {activeTab === 'general' && renderGeneralTab()}
                        {activeTab === 'fuentes' && renderFuentesTab()}
                        {activeTab === 'integracion' && renderIntegracionTab()}
                    </div>

                    <div className="flex-shrink-0 pt-4 border-t border-gray-200 w-full flex justify-end space-x-3">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Guardar Cambios</button>
                    </div>
                </form>
            </div>
            
             {isUploadModalOpen && newFileData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Clasificar Nuevo Documento</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Nombre del archivo</label>
                                <input type="text" value={newFileData.name} readOnly className="w-full bg-gray-100 p-2 rounded border"/>
                            </div>
                             <div>
                                <label className={labelClass}>Categoría</label>
                                <div className="flex space-x-4">
                                    <label><input type="radio" name="category" value="oficial" checked={newFileData.category === 'oficial'} onChange={(e) => setNewFileData(d => d ? {...d, category: e.target.value as any} : null)} /> Oficial</label>
                                    <label><input type="radio" name="category" value="interno" checked={newFileData.category === 'interno'} onChange={(e) => setNewFileData(d => d ? {...d, category: e.target.value as any} : null)} /> Interno</label>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Medio de obtención</label>
                                <input type="text" value={newFileData.medio} onChange={(e) => setNewFileData(d => d ? {...d, medio: e.target.value} : null)} className={formControlClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Link de publicación</label>
                                <input type="text" value={newFileData.link} onChange={(e) => setNewFileData(d => d ? {...d, link: e.target.value} : null)} className={formControlClass} />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                                <button onClick={handleSaveNewFuente} className="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className="w-full md:w-1/3 lg:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 flex flex-col">
                <AgentChat agent={agentData} />
            </div>
        </div>
    );
};

export default AgentForm;