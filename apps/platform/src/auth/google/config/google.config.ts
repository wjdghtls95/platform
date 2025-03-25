import { registerAs } from '@nestjs/config';

export default registerAs('google', () => {
  return {
    webClientId: process.env.GOOGLE_DESKTOP_CLIENT_ID,
    webClientSecret: process.env.GOOGLE_WEB_CLIENT_SECRET,
    webRedirectUri: process.env.GOOGLE_WEB_REDIRECT_URI,
  };
});
