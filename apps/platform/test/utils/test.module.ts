import { Test } from '@nestjs/testing';
import { PlatformModule } from '../../src/platform.module';

export const getTestModule = Test.createTestingModule({
  imports: [PlatformModule],
}).compile();
