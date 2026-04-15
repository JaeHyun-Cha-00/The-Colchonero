# The Colchonero

An independent Atlético Madrid news hub. Not affiliated with Club Atlético de Madrid.

## Features

- Live news feed via Google News RSS
- Match schedule and results (football-data.org)
- La Liga standings
- Squad page with player photos, market values, and stats (SportsAPIPro)
- Club history timeline

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/) + AWS RDS PostgreSQL
- Deployed on [AWS Amplify](https://aws.amazon.com/amplify/)

## Environment Variables

```
FOOTBALL_DATA_API_KEY=   # football-data.org
SPORTS_API_KEY=          # SportsAPIPro v2
DATABASE_URL=            # PostgreSQL connection string
```
