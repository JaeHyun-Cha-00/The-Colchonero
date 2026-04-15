import Image from "next/image";
import { getSquadSports, SportsPlayer } from "@/lib/sportsapipro";
import PlayerCard from "@/components/PlayerCard";

const positionMap: Record<string, string> = {
  G: "Goalkeeper", GK: "Goalkeeper",
  D: "Defender", DF: "Defender",
  M: "Midfielder", MF: "Midfielder",
  F: "Forward", FW: "Forward",
};

function groupPlayers(squad: SportsPlayer[]) {
  const groups: Record<string, SportsPlayer[]> = {
    Goalkeeper: [], Defender: [], Midfielder: [], Forward: [],
  };
  for (const p of squad) {
    if (!p.jerseyNumber || p.jerseyNumber > 25) continue;
    const group = positionMap[p.position] ?? "Forward";
    groups[group].push(p);
  }
  return groups;
}

export default async function PlayersPage() {
  let squad: SportsPlayer[] = [];
  let error = false;
  try {
    squad = await getSquadSports();
  } catch {
    error = true;
  }

  const groups = groupPlayers(squad);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Image
          src="https://crests.football-data.org/78.png"
          alt="Atlético Madrid"
          width={56}
          height={56}
          className="object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold">Squad</h1>
          <p className="text-muted-foreground">Atlético Madrid 2025-26</p>
        </div>
      </div>

      {error && (
        <p className="text-muted-foreground">Unable to load squad. Please try again later.</p>
      )}

      {Object.entries(groups).map(([group, players]) =>
        players.length === 0 ? null : (
          <section key={group} className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              {group}s
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} group={group} />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}
