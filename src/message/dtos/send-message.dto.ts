import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'What is useEffect in React?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content: string;
}
