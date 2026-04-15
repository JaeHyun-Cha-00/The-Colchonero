import Image from "next/image";
import { getStandings } from "@/lib/footballdata";

export const revalidate = 3600;

const ATLETICO_ID = 78;

export default async function StandingsPage() {
  let table;
  try {
    table = await getStandings();
  } catch {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">La Liga Standings</h1>
        <p className="text-muted-foreground">Unable to load standings. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">La Liga Standings</h1>
        <p className="text-muted-foreground">2025-26 Season</p>
      </div>

      <div className="border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2.5rem] sm:grid-cols-[2rem_1fr_3rem_3rem_3rem_3rem_3rem_3.5rem] gap-2 px-4 py-3 bg-muted text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <span>#</span>
          <span>Club</span>
          <span className="text-center">MP</span>
          <span className="text-center">W</span>
          <span className="text-center">D</span>
          <span className="text-center">L</span>
          <span className="text-center">GD</span>
          <span className="text-center font-bold text-foreground">Pts</span>
        </div>

        {/* Table Rows */}
        {table.map((entry, i) => {
          const isAtleti = entry.team.id === ATLETICO_ID;
          const isTop4 = entry.position <= 4;
          const isEuropa = entry.position === 5 || entry.position === 6;
          const isRelegation = entry.position >= 18;

          return (
            <div
              key={entry.team.id}
              className={`grid grid-cols-[2rem_1fr_2rem_2rem_2rem_2rem_2rem_2.5rem] sm:grid-cols-[2rem_1fr_3rem_3rem_3rem_3rem_3rem_3.5rem] gap-2 px-4 py-3 items-center text-sm border-t transition-colors
                ${isAtleti ? "bg-primary/10 font-semibold" : "hover:bg-muted/50"}
                ${i === table.length - 1 ? "" : ""}
              `}
            >
              {/* Position */}
              <span className="flex items-center gap-1">
                <span
                  className={`w-1 h-5 rounded-full inline-block mr-1 ${
                    isTop4 ? "bg-blue-500" :
                    isEuropa ? "bg-orange-400" :
                    isRelegation ? "bg-red-500" :
                    "bg-transparent"
                  }`}
                />
                {entry.position}
              </span>

              {/* Team */}
              <span className="flex items-center gap-2 min-w-0">
                <Image
                  src={entry.team.crest}
                  alt={entry.team.name}
                  width={20}
                  height={20}
                  className="object-contain shrink-0"
                />
                <span className="truncate">
                  {entry.team.shortName}
                  {isAtleti && <span className="ml-1 text-primary text-xs">◀</span>}
                </span>
              </span>

              <span className="text-center text-muted-foreground">{entry.playedGames}</span>
              <span className="text-center">{entry.won}</span>
              <span className="text-center">{entry.draw}</span>
              <span className="text-center">{entry.lost}</span>
              <span className={`text-center ${entry.goalDifference > 0 ? "text-green-600" : entry.goalDifference < 0 ? "text-red-500" : ""}`}>
                {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
              </span>
              <span className="text-center font-bold">{entry.points}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Champions League</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> Europa League</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Relegation</span>
      </div>
    </div>
  );
}
