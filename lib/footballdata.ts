const BASE_URL = "https://api.football-data.org/v4";
const ATLETICO_ID = 78;

function getHeaders() {
  return {
    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY ?? "",
  };
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Score {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  fullTime: { home: number | null; away: number | null };
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  competition: Competition;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
}

async function fetchFD<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`football-data.org error: ${res.status}`);
  return res.json();
}

export async function getUpcomingFixtures(): Promise<Match[]> {
  const data = await fetchFD<{ matches: Match[] }>(
    `/teams/${ATLETICO_ID}/matches?status=SCHEDULED&limit=10`
  );
  return data.matches ?? [];
}

export async function getRecentResults(): Promise<Match[]> {
  const data = await fetchFD<{ matches: Match[] }>(
    `/teams/${ATLETICO_ID}/matches?status=FINISHED&limit=5`
  );
  return (data.matches ?? []).reverse(); // most recent first
}

export interface SquadPlayer {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

export interface TeamDetail {
  crest: string;
  coach: { name: string; nationality: string };
  squad: SquadPlayer[];
}

export async function getSquad(): Promise<TeamDetail> {
  return fetchFD<TeamDetail>(`/teams/${ATLETICO_ID}`);
}

export interface StandingEntry {
  position: number;
  team: { id: number; name: string; shortName: string; crest: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export async function getStandings(): Promise<StandingEntry[]> {
  const data = await fetchFD<{ standings: { type: string; table: StandingEntry[] }[] }>(
    "/competitions/PD/standings"
  );
  const total = data.standings.find((s) => s.type === "TOTAL");
  return total?.table ?? [];
}
