"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SportsPlayer, formatMarketValue, formatContractUntil } from "@/lib/sportsapipro";

const positionColor: Record<string, string> = {
  Goalkeeper: "bg-yellow-100 text-yellow-800",
  Defender: "bg-blue-100 text-blue-800",
  Midfielder: "bg-green-100 text-green-800",
  Forward: "bg-red-100 text-red-800",
};

function getAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function PlayerCard({
  player,
  group,
}: {
  player: SportsPlayer;
  group: string;
}) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const marketValue = formatMarketValue(player.proposedMarketValue);
  const contractUntil = player.contractUntilTimestamp
    ? formatContractUntil(player.contractUntilTimestamp)
    : null;

  return (
    <>
      <Card
        className="hover:shadow-lg transition-shadow group cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-4 flex flex-col items-center text-center">
          {/* Player photo */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 mb-3 flex items-center justify-center">
            {!imgError ? (
              <Image
                src={player.imageUrl}
                alt={player.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>

          {player.jerseyNumber && (
            <p className="text-xs text-muted-foreground mb-1">#{player.jerseyNumber}</p>
          )}
          <h3 className="font-semibold text-sm mb-2 leading-tight">{player.shortName}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${positionColor[group]}`}>
            {group}
          </span>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <span>{player.country?.name}</span>
            {player.dateOfBirth && (
              <span>· {getAge(player.dateOfBirth)} yrs</span>
            )}
          </div>
          {marketValue && (
            <span className="mt-2 text-xs font-semibold text-primary">{marketValue}</span>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              {player.jerseyNumber && (
                <span className="text-2xl font-bold text-muted-foreground">#{player.jerseyNumber}</span>
              )}
              {player.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Photo + badges */}
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center">
                {!imgError ? (
                  <Image
                    src={player.imageUrl}
                    alt={player.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${positionColor[group]}`}>
                  {group}
                </span>
                <Badge variant="outline">{player.country?.name}</Badge>
                {player.dateOfBirth && (
                  <Badge variant="outline">{getAge(player.dateOfBirth)} yrs</Badge>
                )}
                {player.preferredFoot && (
                  <Badge variant="outline">{player.preferredFoot} foot</Badge>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {player.dateOfBirth && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Date of Birth</p>
                  <p className="font-semibold">
                    {new Date(player.dateOfBirth).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {player.height > 0 && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Height</p>
                  <p className="font-semibold">{player.height} cm</p>
                </div>
              )}
              {marketValue && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Market Value</p>
                  <p className="font-semibold text-primary">{marketValue}</p>
                </div>
              )}
              {contractUntil && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Contract Until</p>
                  <p className="font-semibold">{contractUntil}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
