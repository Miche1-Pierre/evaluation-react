'use client';

import { use } from 'react';
import { useConference } from '@/hooks/use-conferences';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Clock, MapPin, Users, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConferenceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: conference, isLoading, isError } = useConference(id);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-[60vh]" />
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !conference) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Conférence introuvable.</p>
      </div>
    );
  }

  const formattedDate = format(new Date(conference.date), 'EEEE d MMMM yyyy', { locale: fr });

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        '--conf-primary': conference.design.mainColor,
        '--conf-secondary': conference.design.secondColor,
      } as React.CSSProperties}
    >
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src={conference.img}
          alt={conference.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, var(--conf-primary)cc 0%, transparent 65%),
              linear-gradient(to top, var(--background) 0%, transparent 40%)
            `,
          }}
        />

        <Button
          variant="ghost"
          size="sm"
          className="absolute top-20 left-6 z-10 text-white hover:text-white hover:bg-white/10"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            Retour
          </Link>
        </Button>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-10 md:px-16 max-w-3xl">
          <Badge
            className="mb-3"
            style={{ backgroundColor: 'var(--conf-secondary)', color: '#fff', border: 'none' }}
          >
            Conférence
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {conference.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formattedDate}
            </span>
            {conference.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {conference.duration}
              </span>
            )}
            {conference.osMap?.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {conference.osMap.city}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 space-y-10">
        {/* Description */}
        <p className="text-muted-foreground text-lg leading-relaxed">
          {conference.description}
        </p>

        {/* Color accent bar */}
        <div
          className="h-0.5 rounded-full"
          style={{ background: `linear-gradient(to right, var(--conf-primary), var(--conf-secondary))` }}
        />

        {/* Rich content */}
        {conference.content && (
          <section>
            <h2 className="text-foreground text-xl font-semibold mb-4">À propos</h2>
            <div
              className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: conference.content }}
            />
          </section>
        )}

        {/* Location */}
        {conference.osMap?.city && (
          <section>
            <h2 className="text-foreground text-xl font-semibold mb-3 flex items-center gap-2">
              <MapPin className="size-5" style={{ color: 'var(--conf-primary)' }} />
              Lieu
            </h2>
            <p className="text-muted-foreground">
              {[
                conference.osMap.addressl1,
                conference.osMap.addressl2,
                conference.osMap.postalCode,
                conference.osMap.city,
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          </section>
        )}

        {/* Speakers */}
        {conference.speakers && conference.speakers.length > 0 && (
          <section>
            <h2 className="text-foreground text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="size-5" style={{ color: 'var(--conf-primary)' }} />
              Intervenants
            </h2>
            <div className="flex flex-wrap gap-3">
              {conference.speakers.map((speaker, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 border border-border bg-card"
                >
                  <Avatar className="size-8">
                    <AvatarFallback
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: 'var(--conf-primary)' }}
                    >
                      {speaker.firstname[0]}{speaker.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-foreground text-sm font-medium">
                    {speaker.firstname} {speaker.lastname}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stakeholders */}
        {conference.stakeholders && conference.stakeholders.length > 0 && (
          <section>
            <h2 className="text-foreground text-xl font-semibold mb-4">Partenaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {conference.stakeholders.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center"
                >
                  <Avatar className="size-14">
                    {s.img && <AvatarImage src={s.img} alt={`${s.firstname} ${s.lastname}`} />}
                    <AvatarFallback
                      className="text-sm font-semibold text-white"
                      style={{ backgroundColor: 'var(--conf-secondary)' }}
                    >
                      {s.firstname[0]}{s.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground text-sm font-medium">
                      {s.firstname} {s.lastname}
                    </p>
                    {s.job && (
                      <p className="text-muted-foreground text-xs">{s.job}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
