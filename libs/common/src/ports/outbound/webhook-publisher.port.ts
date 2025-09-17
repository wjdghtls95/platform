export interface IWebhookPublisher {
  publish(
    url: string,
    payload: unknown,
    headers?: Record<string, string>,
  ): Promise<{ status: number }>;
}
export const WEBHOOK_PUBLISHER = Symbol('WEBHOOK_PUBLISHER');
