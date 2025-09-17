import { Injectable } from '@nestjs/common';

@Injectable()
export class CalendarProvider {
  // ---- ICS 텍스트 빌더 ----
  buildIcsText(p: {
    uid: string;
    start: Date;
    end: Date;
    summary: string;
    description?: string;
  }): string {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//golf-platform//calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${p.uid}`,
      `DTSTAMP:${this.toIcsUtc(new Date())}`,
      `DTSTART:${this.toIcsUtc(p.start)}`,
      `DTEND:${this.toIcsUtc(p.end)}`,
      `SUMMARY:${this.escape(p.summary)}`,
      `DESCRIPTION:${this.escape(p.description ?? '')}`,
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ];
    return lines.join('\r\n');
  }

  // ---- 퍼블릭 링크 빌더 ----
  createIcsUrl(reservationId: number) {
    return `${this.publicBase()}/calendar/ics/${reservationId}`;
  }

  createWebCalUrl(reservationId: number) {
    const http = this.publicBase();
    const webCal = http.replace(/^https?:\/\//, 'webcal://');
    return `${webCal}/calendar/ics/${reservationId}`;
  }

  // ---- 벤더 템플릿 URL ----
  /**
   * 구글 calendar 주소 생성
   */
  createGoogleTemplateUrl(
    start: Date,
    end: Date,
    title: string,
    details?: string,
  ) {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${this.toUtcCompact(start)}/${this.toUtcCompact(end)}`,
      details: details ?? '',
    });
    return `${this.googleBase()}?${params.toString()}`;
  }

  // ---- 캘린더 전용 포맷터 ----
  /**
   * ICS/Google에서 쓰는 UTC 포맷: YYYYMMDDTHHMMSSZ
   */
  toIcsUtc(date: Date): string {
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z');
  }

  /**
   * URL 쿼리용 compact UTC
   */
  toUtcCompact(date: Date): string {
    return this.toIcsUtc(date);
  }

  escape(text: string) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  // ---- ENV 접근 (나중에 ConfigModule로 마이그레이션 가능) ----
  private publicBase(): string {
    return (process.env.PUBLIC_BASE_URL || 'http://localhost:3000').replace(
      /\/$/,
      '',
    );
  }

  private googleBase(): string {
    return (
      process.env.CALENDAR_GOOGLE_BASE_URL ||
      'https://calendar.google.com/calendar/render'
    ).replace(/\/$/, '');
  }
}
