export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  text: string;
}

// Fix: Define IconName here to break circular dependency and export it.
export type IconName = 'CustomTrade' | 'Bank' | 'Convertion' | 'FacReview' | 'NomReview' | 'Inbox' | 'Respond' | 'Risk' | 'CPATax' | 'Travel' | 'Process' | 'Default' | 'CPAMember';

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  customPrompt: string;
  model: string;
  temperature: number;
  topK: number;
  topP: number;
  maxTokens: number;
}

export interface LogEntry {
  id: string;
  user: string;
  agentName: string;
  action: 'creado' | 'editado' | 'eliminado';
  details: string;
  timestamp: Date;
  previousState?: Partial<Agent> | null;
  currentState?: Partial<Agent> | null;
}