import { Test } from '@nestjs/testing';
import { PlatformModule } from '../../src/platform.module';

export const testModule = Test.createTestingModule({
  imports: [PlatformModule],
}).compile();
