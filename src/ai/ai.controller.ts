import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check if Ollama AI is running' })
  async health() {
    const isHealthy = await this.aiService.isHealthy();
    return {
      status: isHealthy ? 'online' : 'offline',
      model: process.env.OLLAMA_MODEL ?? 'llama3.2',
      host: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
      message: isHealthy
        ? 'Ollama is running and ready'
        : 'Ollama is not running. Run: ollama serve',
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Send test message to AI' })
  async chatTest() {
    const response = await this.aiService.chat([
      { role: 'user', content: 'what is React js ?' },
    ]);
    return {
      reply: response.content,
      tokensUsed: response.tokensUsed,
      model: response.model,
    };
  }
}
