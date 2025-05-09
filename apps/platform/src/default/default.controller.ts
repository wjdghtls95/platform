import { Controller, Get } from '@nestjs/common';
import { ApiResponseEntity } from '@libs/common/decorators/api-response-entity.decorator';
import { ResponseEntity } from '@libs/common/networks/response-entity';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Health Check')
export class DefaultController {
  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  health(): ResponseEntity<Record<string, string>> {
    const result = { environment: process.env.NODE_ENV };

    return ResponseEntity.ok().body(result);
  }

  // @Get('/decorate/test')
  // @ApiResponseEntity({ summary: 'auth 데코레이터 테스트' })
  // @Auth()
  // async getUsers(@CurrentUser() user: AuthPayload): Promise<any> {
  //   return {
  //     userId: user.userId,
  //   };
  // }
}
