'use client';

import { useConferences } from '@/hooks/use-conferences';
import { ConferenceHero } from '@/components/public/conference-hero';
import { ConferenceCard } from '@/components/public/conference-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: conferences, isLoading, isError } = useConferences();

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-full h-[70vh]" />
        <div className="px-6 md:px-12 py-10">
          <Skeleton className="h-6 w-48 mb-5" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-lg">Impossible de charger les conférences.</p>
      </div>
    );
  }

  if (!conferences?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-lg">Aucune conférence pour le moment.</p>
      </div>
    );
  }

  const [hero, ...rest] = conferences;

  return (
    <div className="bg-background">
      <ConferenceHero conference={hero} />

      <section className="px-6 md:px-12 py-10">
        <h2 className="text-foreground text-xl font-semibold mb-5 tracking-tight">
          Toutes les conférences
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {rest.map((conf) => (
            <ConferenceCard key={conf.id} conference={conf} />
          ))}
        </div>
      </section>
    </div>
  );
}
