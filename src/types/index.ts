export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  model?: string;
  maxTokens?: number;
}

export interface ResearchResult {
  topic: string;
  research: string;
  sources: string[];
  keyPoints: string[];
}

export interface ArticleResult {
  html: string;
  title: string;
  metadata: {
    wordCount: number;
    createdAt: string;
  };
}

export interface ReviewResult {
  approved: boolean;
  suggestions: string[];
  revisedHtml?: string;
  comments: string;
}

export interface SchemaResult {
  schemas: any[];
  schemaTypes: string[];
}

export interface WorkflowContext {
  topic: string;
  research?: ResearchResult;
  article?: ArticleResult;
  review?: ReviewResult;
  schemas?: SchemaResult;
}

export interface AgentResponse {
  success: boolean;
  data: any;
  error?: string;
}
