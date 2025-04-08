import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IpLocationProvider } from '@libs/common/external/ip/ip-location.provider';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  providers: [IpLocationProvider],
  exports: [IpLocationProvider],
})
export class IpLocationModule {}
