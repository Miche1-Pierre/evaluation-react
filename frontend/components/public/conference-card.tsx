import Link from 'next/link';
import { CalendarDays, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Conference } from '@/types/conference';
import { FavoriteButton } from '@/components/shared/favorite-button';

interface ConferenceCardProps {
  conference: Conference;
  className?: string;
}

export function ConferenceCard({ conference, className }: ConferenceCardProps) {
  const formattedDate = format(new Date(conference.date), 'd MMM yyyy', { locale: fr });

  return (
    <Link
      href={`/conference/${conference.id}`}
      className={cn('group relative block overflow-hidden rounded-xl', className)}
      style={{
        '--conf-primary': conference.design.mainColor,
        '--conf-secondary': conference.design.secondColor,
      } as React.CSSProperties}
    >
      {/* 16:9 image */}
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={conference.img}
          alt={conference.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Favorite button */}
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton 
          conferenceId={conference.id} 
          className="bg-black/50 backdrop-blur-sm hover:bg-black/70"
        />
      </div>

      {/* Gradient + text overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3"
        style={{
          background: `linear-gradient(to top, var(--conf-primary) 0%, transparent 65%)`,
        }}
      >
        <div className="translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-white leading-tight mb-1">
            {conference.title}
          </h3>
          <div className="flex items-center gap-2 text-white/75 text-xs">
            <span className="flex items-center gap-0.5">
              <CalendarDays className="size-3" />
              {formattedDate}
            </span>
            {conference.duration && (
              <span className="flex items-center gap-0.5">
                <Clock className="size-3" />
                {conference.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Border accent on hover */}
      <div
        className="absolute inset-0 rounded-xl border-2 border-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ borderColor: 'var(--conf-primary)' }}
      />
    </Link>
  );
}
