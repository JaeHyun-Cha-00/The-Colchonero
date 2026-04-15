import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAtletiNews } from "@/lib/news";
import { getUpcomingFixtures } from "@/lib/footballdata";

export const revalidate = 1800;

export default async function HomePage() {
  const [news, upcoming] = await Promise.all([
    getAtletiNews(6),
    getUpcomingFixtures().catch(() => []),
  ]);

  const nextMatch = upcoming[0] ?? null;
  const [featured, ...rest] = news;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Next Match Banner */}
      {nextMatch && (
        <div className="bg-primary text-primary-foreground rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-white/70 uppercase tracking-widest">Next Match</span>
            <span className="font-bold text-lg">
              {nextMatch.homeTeam.shortName} vs {nextMatch.awayTeam.shortName}
            </span>
            <Badge className="bg-white text-primary text-xs">{nextMatch.competition.name}</Badge>
          </div>
          <div className="text-sm text-white/80 flex items-center gap-3">
            <span>📅 {new Date(nextMatch.utcDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
            <span>🕙 {new Date(nextMatch.utcDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} UTC</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main News Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Latest News</h2>
            <Link href="/news" className="text-sm text-primary font-medium hover:underline">
              All news →
            </Link>
          </div>

          {/* Featured Story */}
          {featured && (
            <Link href={featured.link} target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {featured.source}
                  </span>
                  <h3 className="text-xl font-bold mt-3 mb-2 group-hover:text-primary transition-colors leading-snug">
                    {featured.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-3">{featured.pubDate}</p>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Other Stories */}
          <div className="space-y-3">
            {rest.map((article, i) => (
              <Link key={i} href={article.link} target="_blank" rel="noopener noreferrer">
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {article.source}
                        </span>
                        <h3 className="font-semibold text-sm mt-2 group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </h3>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{article.pubDate}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Explore</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/schedule", icon: "📅", label: "Schedule" },
                { href: "/players", icon: "👤", label: "Squad" },
                { href: "/history", icon: "🏆", label: "History" },
                { href: "/news", icon: "📰", label: "All News" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:border-primary hover:shadow-md transition-all text-center group"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium group-hover:text-primary">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Club Motto */}
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-6 text-center">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Club Motto</p>
              <p className="text-lg font-bold italic">&ldquo;El Atleti nunca se rinde&rdquo;</p>
              <p className="text-sm text-white/70 mt-1">Atleti never surrenders.</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
