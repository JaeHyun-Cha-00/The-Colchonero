import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPlayerDetail, getPlayerMatches } from "@/lib/footballdata";

const ATLETICO_ID = 78;

function getAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const positionColor: Record<string, string> = {
  Goalkeeper: "bg-yellow-100 text-yellow-800",
  Defender: "bg-blue-100 text-blue-800",
  Midfielder: "bg-green-100 text-green-800",
  Forward: "bg-red-100 text-red-800",
};

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playerId = Number(id);

  let player;
  let matches;
  try {
    [player, matches] = await Promise.all([
      getPlayerDetail(playerId),
      getPlayerMatches(playerId),
    ]);
  } catch {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-muted-foreground">Player not found.</p>
        <Link href="/players" className="text-primary hover:underline text-sm mt-4 inline-block">← Back to Squad</Link>
      </div>
    );
  }

  const posColor = positionColor[player.position] ?? "bg-gray-100 text-gray-800";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/players" className="text-sm text-primary hover:underline mb-6 inline-block">
        ← Back to Squad
      </Link>

      {/* Player Header */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-5xl shrink-0">
          👤
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            {player.shirtNumber && (
              <span className="text-3xl font-bold text-muted-foreground">#{player.shirtNumber}</span>
            )}
            <h1 className="text-3xl font-bold">{player.name}</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${posColor}`}>
              {player.position}
            </span>
            <Badge variant="outline">{player.nationality}</Badge>
            {player.dateOfBirth && (
              <Badge variant="outline">{getAge(player.dateOfBirth)} years old</Badge>
            )}
          </div>
        </div>
        {player.currentTeam?.crest && (
          <Image
            src={player.currentTeam.crest}
            alt={player.currentTeam.name}
            width={56}
            height={56}
            className="object-contain shrink-0"
          />
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {player.dateOfBirth && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Date of Birth</p>
              <p className="font-semibold">{formatDate(player.dateOfBirth)}</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Nationality</p>
            <p className="font-semibold">{player.nationality}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Position</p>
            <p className="font-semibold">{player.position}</p>
          </CardContent>
        </Card>
        {player.currentTeam?.venue && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Stadium</p>
              <p className="font-semibold">{player.currentTeam.venue}</p>
            </CardContent>
          </Card>
        )}
        {player.currentTeam?.contract?.until && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Contract Until</p>
              <p className="font-semibold">{player.currentTeam.contract.until}</p>
            </CardContent>
          </Card>
        )}
        {player.currentTeam?.runningCompetitions?.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Competitions</p>
              <div className="flex flex-wrap gap-2">
                {player.currentTeam.runningCompetitions.map((c) => (
                  <div key={c.name} className="flex items-center gap-1">
                    <Image src={c.emblem} alt={c.name} width={16} height={16} className="object-contain" />
                    <span className="text-sm">{c.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Matches */}
      {matches.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Matches</h2>
          <div className="space-y-3">
            {matches.map((match) => {
              const isHome = match.homeTeam.id === ATLETICO_ID;
              const atlScore = isHome ? match.score.fullTime.home : match.score.fullTime.away;
              const oppScore = isHome ? match.score.fullTime.away : match.score.fullTime.home;
              const opponent = isHome ? match.awayTeam : match.homeTeam;
              const isWin = match.score.winner === (isHome ? "HOME_TEAM" : "AWAY_TEAM");
              const isDraw = match.score.winner === "DRAW";

              return (
                <div key={match.id} className="flex items-center justify-between p-3 border rounded-xl bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <Image src={opponent.crest} alt={opponent.name} width={24} height={24} className="object-contain" />
                    <div>
                      <p className="text-sm font-medium">vs {opponent.shortName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.utcDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}{match.competition.name}
                        {" · "}{isHome ? "Home" : "Away"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{atlScore} - {oppScore}</span>
                    <Badge className={isWin ? "bg-green-600" : isDraw ? "bg-gray-400" : "bg-red-600"}>
                      {isWin ? "W" : isDraw ? "D" : "L"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
