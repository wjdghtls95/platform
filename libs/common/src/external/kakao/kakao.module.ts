import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KakaoProvider } from '@libs/common/external/kakao/kakao.provider';

@Module({
  providers: [KakaoProvider],
  exports: [KakaoProvider],
})
export class KakaoModule {}
