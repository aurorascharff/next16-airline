import { getAirports } from '../airport-queries';

export async function HubOptions() {
  const airports = await getAirports();
  return airports.filter(airport => airport.hub).map(airport => <AirportOption airport={airport} key={airport.code} />);
}

export async function DestinationOptions() {
  const airports = await getAirports();
  return airports
    .filter(airport => !airport.hub)
    .map(airport => <AirportOption airport={airport} key={airport.code} />);
}

function AirportOption({ airport }: { airport: { city: string; code: string } }) {
  return (
    <option value={airport.code}>
      {airport.city} ({airport.code})
    </option>
  );
}
