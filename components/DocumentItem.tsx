import { apiDocuments } from "@/lib/api/documents";
import { Fuente } from "@/types";
import { EyeIcon, TrashIcon } from "lucide-react";

interface DocumentItemProps {
  fuente: Fuente;
  selectedFuenteId: string | null;
  handleSelectFuente: (fuenteId: string) => void;
}

const DocumentItem = ({
  fuente,
  selectedFuenteId,
  handleSelectFuente,
}: DocumentItemProps) => {
  const handleOpenDocument = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Lógica para abrir el documento, por ejemplo, abrir el enlace en una nueva pestaña
    const presignedUrl = await apiDocuments.getDocumentPresignedUrl({
      documentId: fuente.id,
    });
    console.log('Presigned URL:::', presignedUrl);
    window.open(presignedUrl, '_blank');
  };

  return (
    <div
      key={fuente.id.toString()}
      onClick={() => handleSelectFuente(fuente.id)}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        selectedFuenteId === fuente.id
          ? 'bg-[#374151] text-white'
          : 'hover:bg-[#2d3748]'
      }`}
    >
      <span className="truncate text-sm">{fuente.name}</span>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          type="button"
          className="p-1 hover:text-blue-400 transition-colors"
          onClick={handleOpenDocument}
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
          className="p-1 hover:text-red-500 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DocumentItem;