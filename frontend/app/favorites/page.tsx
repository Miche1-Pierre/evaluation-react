'use client';

import { useFavorites } from '@/hooks/use-favorites';
import { ConferenceCard } from '@/components/public/conference-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FavoritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: favorites, isLoading } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Retour
            </Link>
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Heart className="size-8 text-red-500 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Mes Favoris
            </h1>
          </div>
          <p className="text-muted-foreground">
            Les conférences que vous avez enregistrées
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-xl" />
            ))}
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="size-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">Aucun favori</h3>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore enregistré de conférence
            </p>
            <Button asChild>
              <Link href="/">Découvrir les conférences</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((conference) => (
              <ConferenceCard key={conference.id} conference={conference} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
