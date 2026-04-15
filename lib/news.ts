import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ["source"],
  },
});

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export async function getAtletiNews(limit = 20): Promise<NewsItem[]> {
  const feed = await parser.parseURL(
    "https://news.google.com/rss/search?q=Atletico+Madrid&hl=en-US&gl=US&ceid=US:en"
  );

  return feed.items.slice(0, limit).map((item) => ({
    title: item.title ?? "",
    link: item.link ?? "",
    pubDate: timeAgo(item.pubDate ?? ""),
    source: (item as { source?: { _: string } }).source?._ ?? item.creator ?? "Unknown",
    snippet: stripHtml(item.content ?? item.contentSnippet ?? ""),
  }));
}
