import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';

export interface ChatMessage {
  role: string;
  content: string;
}

export interface AiResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

@Injectable()
export class AiService {
  private readonly ollama: Ollama;
  private readonly model: string;

  constructor() {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
    });
    this.model = process.env.OLLAMA_MODEL ?? 'llama3.2';
  }

  async chat(messages: ChatMessage[]): Promise<AiResponse> {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: messages,
        stream: false,
      });
      const content = response.message.content;
      const tokensUsed = response.eval_count ?? this.estimateTokens(content);
      return {
        content,
        tokensUsed,
        model: this.model,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: 503,
          message: 'AI unavailable. Make sure Ollama is running: ollama serve',
          error: 'Service Unavailable',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.split(' ').length * 1.3);
  }
  async isHealthy(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch {
      return false;
    }
  }
}
