import { ApiService } from "./api";

class ApiChat extends ApiService {
  constructor() {
    super();
  }
  async converse({ service_id, message }: { service_id: string, message: string }): Promise<string> {
    const body = {
      message: message,
      username: 'default_user',
      service_id: service_id
    }
    const response = await this.api.post('/conversation', body);
    console.log('Converse response:', response);
    
    return response.data.answer;
  }
}

export const apiChat = new ApiChat();