import { NestFactory } from '@nestjs/core';
import { PlatformModule } from './platform.module';
import { PlatformServer } from './platform.server';

async function platformServer(): Promise<void> {
  const app = await NestFactory.create(PlatformModule);

  const platformServer = new PlatformServer(app);
  platformServer.init();
  await platformServer.run();
}
void platformServer();
