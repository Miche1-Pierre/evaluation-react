import Link from "next/link";
import { CalendarDays, Clock, Play, Info } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Conference } from "@/types/conference";
import Image from "next/image";

interface ConferenceHeroProps {
  conference: Conference;
}

export function ConferenceHero({ conference }: Readonly<ConferenceHeroProps>) {
  const formattedDate = format(new Date(conference.date), "EEEE d MMMM yyyy", {
    locale: fr,
  });

  return (
    <div
      className="relative w-full h-[75vh] min-h-130 overflow-hidden"
      style={
        {
          "--conf-primary": conference.design.mainColor,
          "--conf-secondary": conference.design.secondColor,
        } as React.CSSProperties
      }
    >
      {/* Background image */}
      <Image
        src={conference.img}
        alt={conference.title}
        className="absolute inset-0 h-full w-full object-cover"
        priority-hint="high"
      />

      {/* Multi-stop gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, var(--conf-primary)e6 0%, var(--conf-primary)40 40%, transparent 65%),
            linear-gradient(to top, var(--background) 0%, transparent 35%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-16 md:px-16 max-w-187.5">
        <Badge
          className="mb-4 w-fit text-white border-none"
          style={{ backgroundColor: "var(--conf-secondary)" }}
        >
          À la une
        </Badge>

        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
          {conference.title}
        </h1>

        <div className="flex items-center gap-4 text-white/75 text-sm mb-5">
          <span className="flex items-center gap-1.5 capitalize">
            <CalendarDays className="size-4" />
            {formattedDate}
          </span>
          {conference.duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {conference.duration}
            </span>
          )}
        </div>

        <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-7 max-w-130 leading-relaxed">
          {conference.description}
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            className="font-semibold text-white shadow-lg"
            style={{ backgroundColor: "var(--conf-primary)" }}
            asChild
          >
            <Link href={`/conference/${conference.id}`}>
              <Play className="size-4 fill-white" />
              Voir la conférence
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            asChild
          >
            <Link href={`/conference/${conference.id}`}>
              <Info className="size-4" />
              Plus d&apos;infos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
