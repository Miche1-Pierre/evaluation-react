'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToggleFavorite, useIsFavorite } from '@/hooks/use-favorites';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  conferenceId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({
  conferenceId,
  variant = 'ghost',
  size = 'icon',
  className,
  showText = false,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: favoriteStatus } = useIsFavorite(conferenceId);
  const toggleFavorite = useToggleFavorite();

  const isFavorite = favoriteStatus?.isFavorite ?? false;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    await toggleFavorite.mutateAsync({
      conferenceId,
      isFavorite,
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={toggleFavorite.isPending}
      className={cn(
        'transition-all',
        isFavorite && 'text-red-500 hover:text-red-600',
        className
      )}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        className={cn(
          'size-5 transition-all',
          isFavorite && 'fill-current'
        )}
      />
      {showText && (
        <span className="ml-2">
          {isFavorite ? 'Enregistré' : 'Enregistrer'}
        </span>
      )}
    </Button>
  );
}
