const BASE_URL = "https://v2.football.sportsapipro.com";
const ATLETICO_ID = 2836;

function getHeaders() {
  return { "x-api-key": process.env.SPORTS_API_KEY ?? "" };
}

async function fetchSports<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`SportsAPIPro error: ${res.status}`);
  return res.json();
}

export interface SportsPlayer {
  id: number;
  name: string;
  shortName: string;
  position: string;
  jerseyNumber: number;
  shirtNumber: number;
  height: number;
  dateOfBirth: string;
  contractUntilTimestamp: number;
  proposedMarketValue: number | null;
  preferredFoot: string;
  country: { name: string; alpha2: string };
  imageUrl: string;
}

export async function getSquadSports(): Promise<SportsPlayer[]> {
  const data = await fetchSports<{ data: { players: { player: Record<string, unknown> }[] } }>(
    `/api/teams/${ATLETICO_ID}/players`
  );

  return data.data.players.map(({ player: p }) => ({
    id: p.id as number,
    name: p.name as string,
    shortName: p.shortName as string,
    position: p.position as string,
    jerseyNumber: (p.jerseyNumber ?? p.shirtNumber) as number,
    shirtNumber: p.shirtNumber as number,
    height: p.height as number,
    dateOfBirth: p.dateOfBirth as string,
    contractUntilTimestamp: p.contractUntilTimestamp as number,
    proposedMarketValue: p.proposedMarketValue as number | null,
    preferredFoot: p.preferredFoot as string,
    country: p.country as { name: string; alpha2: string },
    imageUrl: `/api/player-image/${p.id}`,
  }));
}

export function formatMarketValue(value: number | null): string | null {
  if (!value) return null;
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
  return `€${value}`;
}

export function formatContractUntil(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
    month: "short", year: "numeric",
  });
}
