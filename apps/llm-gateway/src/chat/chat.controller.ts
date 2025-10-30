import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatOutDto } from './dto/chat-out.dto';
import { ChatInDto } from './dto/chat-in.dto';
import { UsageLoggerInterceptor } from '../cost/usage-logger.interceptor';
import { ApiKeyAuth } from '@libs/common/decorators/api-key-auth.decorator';

@ApiTags('LLM Gateway')
@Controller()
@ApiKeyAuth()
@UseInterceptors(UsageLoggerInterceptor) // 📊 컨트롤러 전체에 비용 로깅 인터셉터 적용
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * LLM 채팅 요청을 처리하는 메인 엔드포인트
   * (POST /llm-gateway/chat)
   */
  @Post('chat')
  @HttpCode(HttpStatus.OK) // 성공 시 200 OK 반환
  @ApiOperation({ summary: 'LLM 채팅 요청 (내부 전용)' })
  @ApiHeader({
    name: 'X-Internal-API-Key',
    description: '내부 서비스 인증 키',
    required: true,
  })
  async chat(
    @Body() chatOutDto: ChatOutDto, // 요청 Body의 유효성 검사(ValidationPipe)
  ): Promise<ChatInDto> {
    // 모든 로직은 ChatService에 위임
    return await this.chatService.processChat(chatOutDto);
  }
}
