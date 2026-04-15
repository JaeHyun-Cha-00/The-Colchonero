import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAtletiNews } from "@/lib/news";
import Link from "next/link";

export const revalidate = 1800; // refresh every 30 minutes

export default async function NewsPage() {
  let articles = await getAtletiNews(20);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">News</h1>
        <p className="text-muted-foreground">
          Latest Atlético Madrid news from around the world
        </p>
      </div>

      <div className="space-y-4">
        {articles.map((article, i) => (
          <Link key={i} href={article.link} target="_blank" rel="noopener noreferrer">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {article.source}
                  </span>
                  <span className="text-xs text-muted-foreground">{article.pubDate}</span>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-center text-muted-foreground text-sm mt-10">
        Powered by Google News · Updates every 30 minutes
      </p>
    </div>
  );
}
