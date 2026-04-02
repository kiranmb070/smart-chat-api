import { v4 as uuidv4 } from 'uuid';
export class Conversation {
  constructor(
    public id: string,
    public userId: string,
    public title: string,
    public model: string,
    public totalTokensUsed: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(userId: string, title?: string, model?: string): Conversation {
    return new Conversation(
      uuidv4(),
      userId,
      title ?? 'New Chat',
      model ?? 'Ollama3.2',
      0,
      new Date(),
      new Date(),
    );
  }
  static ofExisting(data: {
    id: string;
    userId: string;
    title: string;
    model: string;
    totalTokensUsed: number;
    createdAt: Date;
    updatedAt: Date;
  }): Conversation {
    return new Conversation(
      data.id,
      data.userId,
      data.title,
      data.model,
      data.totalTokensUsed,
      data.createdAt,
      data.updatedAt,
    );
  }

  addTokens(tokens: number): void {
    this.totalTokensUsed += tokens;
    this.updatedAt = new Date();
  }

  updateProps({ title, totalTokensUsed }) {
    this.title = title;
    this.totalTokensUsed = totalTokensUsed;
  }
}
