import { NestFactory } from '@nestjs/core';
import { LLMGatewayModule } from './llm-gateway.module';
import { LLMGatewayServer } from './llm-gateway.server';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(LLMGatewayModule);

  const llmGatewayServer = new LLMGatewayServer(app);

  llmGatewayServer.init();

  await llmGatewayServer.run();
}

void bootstrap();
