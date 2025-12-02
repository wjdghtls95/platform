import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IpLocationProvider } from '@libs/common/external/ip/ip-location.provider';
import { HttpClientModule } from '@libs/common/external/http/http-client.module';
import { ipLocationHttpConfig } from '@libs/common/external/http/configs/http-client.config';

@Module({
  providers: [IpLocationProvider],
  exports: [IpLocationProvider],
})
export class IpLocationModule {}
