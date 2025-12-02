import { Module } from '@nestjs/common';
import { LLmGatewayProvider } from '@libs/common/external/llm-gateway/llm-gateway.provider';

@Module({
  providers: [LLmGatewayProvider],
  exports: [LLmGatewayProvider],
})
export class LLmGatewayModule {}
