'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-md'
          : 'bg-gradient-to-b from-black/70 to-transparent',
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <Logo />

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          
          {isAdmin && (
            <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground" asChild>
              <Link href="/admin/conferences">
                <Settings className="size-4" />
                Administration
              </Link>
            </Button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm hidden sm:block">
                {user?.id}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/register">S'inscrire</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
