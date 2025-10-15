import React from 'react';
import type { LogEntry } from '@/types';

interface ChangelogProps {
    logs: LogEntry[];
    onViewDetails: (log: LogEntry) => void;
}

const Changelog: React.FC<ChangelogProps> = ({ logs, onViewDetails }) => {
    
    const getActionStyles = (action: LogEntry['action']) => {
        switch (action) {
            case 'creado':
                return 'bg-green-100 text-green-800';
            case 'editado':
                return 'bg-yellow-100 text-yellow-800';
            case 'eliminado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-4xl text-[#232A37] uppercase font-oswald mb-6">Log de Cambios</h1>
            {logs.length === 0 ? (
                <p className="text-gray-500">No hay cambios registrados todavía.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Agente</th>
                                <th scope="col" className="px-6 py-3">Acción</th>
                                <th scope="col" className="px-6 py-3">Detalles</th>
                                <th scope="col" className="px-6 py-3">Usuario</th>
                                <th scope="col" className="px-6 py-3">Fecha y Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {log.agentName}
                                    </th>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getActionStyles(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        <button onClick={() => onViewDetails(log)} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors text-left">
                                            {log.details}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.user}
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.timestamp.toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Changelog;