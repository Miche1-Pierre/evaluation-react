'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Ressource introuvable</h2>
        <p className="text-muted-foreground">
          La ressource demandée n&apos;existe pas dans l&apos;administration.
        </p>
        <Button variant="outline" asChild>
          <Link href="/admin/conferences">
            <ArrowLeft className="mr-2 size-4" />
            Retour aux conférences
          </Link>
        </Button>
      </div>
    </div>
  );
}
