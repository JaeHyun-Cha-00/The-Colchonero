import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getSquad, SquadPlayer } from "@/lib/footballdata";

const positionColor: Record<string, string> = {
  "Goalkeeper": "bg-yellow-100 text-yellow-800",
  "Defender": "bg-blue-100 text-blue-800",
  "Midfielder": "bg-green-100 text-green-800",
  "Forward": "bg-red-100 text-red-800",
  "Offence": "bg-red-100 text-red-800",
};

function getAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function groupPlayers(squad: SquadPlayer[]) {
  const groups: Record<string, SquadPlayer[]> = {
    Goalkeeper: [],
    Defender: [],
    Midfielder: [],
    Forward: [],
  };
  for (const p of squad) {
    if (p.position in groups) groups[p.position].push(p);
    else if (p.position === "Offence") groups.Forward.push(p);
    else groups.Forward.push(p);
  }
  return groups;
}

function getFlagEmoji(nationality: string): string {
  const flags: Record<string, string> = {
    "Spain": "🇪🇸", "France": "🇫🇷", "Argentina": "🇦🇷", "Brazil": "🇧🇷",
    "Portugal": "🇵🇹", "Germany": "🇩🇪", "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Netherlands": "🇳🇱",
    "Belgium": "🇧🇪", "Uruguay": "🇺🇾", "Slovenia": "🇸🇮", "Croatia": "🇭🇷",
    "Morocco": "🇲🇦", "Nigeria": "🇳🇬", "Mozambique": "🇲🇿", "Colombia": "🇨🇴",
    "Mexico": "🇲🇽", "Chile": "🇨🇱", "Paraguay": "🇵🇾", "Serbia": "🇷🇸",
    "Poland": "🇵🇱", "Turkey": "🇹🇷", "Czech Republic": "🇨🇿",
  };
  return flags[nationality] ?? "🌍";
}

export default async function PlayersPage() {
  let teamDetail;
  try {
    teamDetail = await getSquad();
  } catch {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4">Squad</h1>
        <p className="text-muted-foreground">Unable to load squad data. Please try again later.</p>
      </div>
    );
  }

  const { squad, crest, coach } = teamDetail;
  const groups = groupPlayers(squad);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Image src={crest} alt="Atlético Madrid" width={56} height={56} className="object-contain" />
        <div>
          <h1 className="text-3xl font-bold">Squad</h1>
          <p className="text-muted-foreground">
            Atlético Madrid 2024-25 · Coach: {coach.name}
          </p>
        </div>
      </div>

      {Object.entries(groups).map(([group, players]) =>
        players.length === 0 ? null : (
          <section key={group} className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              {group}s
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {players.map((player) => (
                <Card key={player.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    {/* Avatar placeholder */}
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-3 group-hover:bg-primary/20 transition-colors">
                      {getFlagEmoji(player.nationality)}
                    </div>
                    <h3 className="font-semibold text-sm mb-2 leading-tight">{player.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${positionColor[player.position] ?? "bg-gray-100 text-gray-800"}`}>
                      {player.position}
                    </span>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <span>{player.nationality}</span>
                      {player.dateOfBirth && (
                        <span>· {getAge(player.dateOfBirth)} yrs</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}
