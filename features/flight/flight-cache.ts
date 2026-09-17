export const flightTags = {
  all: 'flights',
  detail: (flightId: string) => `flight:${flightId}`,
  from: (originCode: string) => `flights-from:${originCode}`,
  offer: (flightId: string) => `flight-offer:${flightId}`,
  route: (from: string, to: string) => `flights:${from}:${to}`,
  to: (destinationCode: string) => `flights-to:${destinationCode}`,
};
