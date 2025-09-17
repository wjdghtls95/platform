import { registerAs } from '@nestjs/config';

export default registerAs('platform-http', () => ({
  baseUrl: process.env.PLATFORM_BASE_URL,
  internalApiKey: process.env.INTERNAL_API_KEY,
}));
