export const bookingTags = {
  detail: (bookingId: string) => `booking:${bookingId}`,
  user: (userId: string) => `bookings:${userId}`,
};
