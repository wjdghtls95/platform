import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import llmGatewayRedisConfig from './llm-gateway-redis.config';

const environment = process.env.NODE_ENV || 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./config/.llm-gateway.${environment}.env`,
      isGlobal: true,
      cache: true,
      load: [llmGatewayRedisConfig],
    }),
  ],
})
export class LLmGatewayServerConfigModule {}
