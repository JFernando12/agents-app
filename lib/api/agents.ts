import { Agent } from "@/types";
import { ApiService } from "./api";

class ApiAgents extends ApiService {
  constructor() {
    super();
  }

  getAgents = async (): Promise<Agent[]> => {
    const response = await this.api.get("/services");
    const data = response.data;
    console.log('Fetched agents data:', data);
    const formattedData = data.services.map((service: any) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      model: service.model,
      customPrompt: service.custom_prompt,
      temperature: service.temperature,
      maxTokens: service.max_tokens,
      topP: service.top_p,
      topK: service.top_k,
      icon: service.icon,
    }));
    return formattedData;
  };

  createAgent = async (agentData: Omit<Agent, "id">): Promise<Agent> => {
    const bodyFormatted = {
      name: agentData.name,
      description: agentData.description,
      icon: agentData.icon,
      custom_prompt: agentData.customPrompt,
      model: agentData.model,
      temperature: agentData.temperature,
      top_k: agentData.topK,
      top_p: agentData.topP,
      max_tokens: agentData.maxTokens,
    };

    const response = await this.api.post("/services", bodyFormatted);
    const data = response.data;

    const formattedData = {
      id: data.id,
      name: data.name,
      description: data.description,
      model: data.model,
      customPrompt: data.custom_prompt,
      temperature: data.temperature,
      maxTokens: data.max_tokens,
      topP: data.top_p,
      topK: data.top_k,
      icon: data.icon,
    };

    return formattedData;
  };

  updateAgent = async (id: string, agentData: Omit<Agent, "id">): Promise<Agent> => {
    const bodyFormatted = {
      name: agentData.name,
      description: agentData.description,
      icon: agentData.icon,
      custom_prompt: agentData.customPrompt,
      model: agentData.model,
      temperature: agentData.temperature,
      top_k: agentData.topK,
      top_p: agentData.topP,
      max_tokens: agentData.maxTokens,
    };

    const response = await this.api.put(`/service/${id}`, bodyFormatted);
    const data = response.data;

    const formattedData = {
      id: data.id,
      name: data.name,
      description: data.description,
      model: data.model,
      customPrompt: data.custom_prompt,
      temperature: data.temperature,
      maxTokens: data.max_tokens,
      topP: data.top_p,
      topK: data.top_k,
      icon: data.icon,
    };

    return formattedData;
  };
}

export const apiAgents = new ApiAgents();
