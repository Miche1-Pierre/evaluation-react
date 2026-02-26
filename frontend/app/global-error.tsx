'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="mx-auto max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="size-12 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Erreur critique
              </h1>
              <p className="text-muted-foreground">
                Une erreur critique s&apos;est produite. Veuillez rafraîchir la page.
              </p>
            </div>

            <Button onClick={reset} size="lg">
              Rafraîchir la page
            </Button>

            {error.digest && (
              <p className="text-xs text-muted-foreground">
                ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
