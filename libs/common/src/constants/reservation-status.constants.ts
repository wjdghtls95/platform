export const RESERVATION_STATUS = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  cancelled: 'CANCELLED',
  rejected: 'REJECTED',
} as const;

export type ReservationStatus =
  (typeof RESERVATION_STATUS)[keyof typeof RESERVATION_STATUS];

export const RESERVATION_EVENT = {
  created: 'RESERVATION_CREATED',
  cancelled: 'RESERVATION_CANCELED',
  failed: 'RESERVATION_FAILED',
} as const;

export type ReservationEvent =
  (typeof RESERVATION_EVENT)[keyof typeof RESERVATION_EVENT];
