export type CalendarPref =
  | 'google'
  | 'apple'
  | 'samsung'
  | 'ics'
  | 'webcal'
  | 'auto';

export type CalendarLinks = {
  googleTemplateUrl: string;
  icsUrl: string; // http(s) 다운로드
  webcalUrl: string; // webcal:// 구독
};
