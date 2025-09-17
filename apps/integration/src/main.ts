import { NestFactory } from '@nestjs/core';
import { IntegrationModule } from './integration.module';
import { IntegrationServer } from './integration.server';

async function integrationServer(): Promise<void> {
  const app = await NestFactory.create(IntegrationModule);

  const integrationServer = new IntegrationServer(app);
  integrationServer.init();
  await integrationServer.run();
}
void integrationServer();
