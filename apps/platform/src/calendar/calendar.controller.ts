import { ApiOkResponse, ApiProduces, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Redirect,
  Headers,
  Res,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {
  CalendarLinkOutDto,
  IcsTextOutDto,
} from '@libs/dao/platform/calendar/dto/calendar.dto';
import { Response } from 'express';

@Controller('calendar')
@ApiTags('Calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // @Get('/ics')
  // @Header('Content-Type', 'text/calendar; charset=utf-8')
  // @Header('Content-Disposition', 'attachment; filename="reservation.ics"')
  // async getIcs(
  //   @Query('reservationId', ParseIntPipe) reservationId: number,
  // ): Promise<IcsTextOutDto> {
  //   const icsTextOutDto = await this.calendarService.createIcsByReservationId(
  //     reservationId,
  //   );
  //
  //   return icsTextOutDto;
  // }

  @Get('/ics')
  @ApiQuery({ name: 'reservationId', type: Number, required: true })
  @ApiProduces('text/calendar')
  @ApiOkResponse({
    description: 'iCalendar (.ics) file',
    content: { 'text/calendar': { schema: { type: 'string' } } },
  })
  async getIcs(
    @Query('reservationId', ParseIntPipe) reservationId: number,
    @Res() res: Response, // ← 직접 응답
  ): Promise<void> {
    const dto: IcsTextOutDto =
      await this.calendarService.createIcsByReservationId(reservationId);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="reservation.ics"',
    );
    res.setHeader('Content-Transfer-Encoding', 'binary');
    res.setHeader('Cache-Control', 'no-cache');

    res.send(dto.icsText); // ← JSON 래핑 없이 순수 텍스트
  }

  @Get('/links')
  async getLinks(
    @Query('reservationId', ParseIntPipe) reservationId: number,
  ): Promise<CalendarLinkOutDto> {
    const calendarLinkOutDto = await this.calendarService.createCalendarLinks(
      reservationId,
    );

    return calendarLinkOutDto;
  }

  @Get('/select')
  @Redirect(undefined, 302)
  async select(
    @Query('reservationId', ParseIntPipe) reservationId: number,
    @Query('pref') pref: 'auto' | 'google' | 'ics' | 'webcal' = 'auto',
    @Headers('user-agent') userAgent?: string,
  ): Promise<{ url: string }> {
    const url = await this.calendarService.selectCalendarLink(
      reservationId,
      pref,
      userAgent,
    );

    return { url };
  }
}
