import axios from 'axios';
import { ApiService } from './api';
import { Fuente } from '@/types';

class ApiDocuments extends ApiService {
  constructor() {
    super();
  }

  getDocuments = async (serviceId: string): Promise<Fuente[]> => {
    const response = await this.api.get(`/documents?service_id=${serviceId}`);
    const data = response.data;

    const formattedData = data.documents.map((doc: any) => ({
      id: doc.id,
      name: doc.file_name,
      type: doc.type,
      createdAt: new Date(doc.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));

    return formattedData;
  };

  uploadDocument = async ({
    serviceId,
    data: { file, name, category, medio, link },
  }: {
    serviceId: string;
    data: {
      file: File;
      name: string;
      category: 'oficial' | 'interno';
      medio: string;
      link: string;
    };
  }): Promise<void> => {
    const response = await this.api.post('/upload-data', {
      service_id: serviceId,
      file_name: name,
      category,
      medio,
      link,
    });
    const presignedUrl = response.data.presignedUrl;

    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  };
}

export const apiDocuments = new ApiDocuments();
