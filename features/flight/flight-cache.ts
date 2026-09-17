export const flightTags = {
  holds: (flightId: string) => `flight-holds:${flightId}`,
  offer: (flightId: string) => `flight-offer:${flightId}`,
};
