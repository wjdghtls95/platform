import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KakaoProvider } from '@libs/common/external/kakao/kakao.provider';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  providers: [KakaoProvider],
  exports: [KakaoProvider],
})
export class KakaoModule {}
