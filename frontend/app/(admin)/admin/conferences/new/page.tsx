'use client';

import { ConferenceForm } from '@/components/admin/conferences/conference-form';
import { useCreateConference } from '@/hooks/use-conferences';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewConferencePage() {
  const router = useRouter();
  const createConference = useCreateConference();

  const handleSubmit = async (data: any) => {
    const dateValue = new Date(data.date);
    if (isNaN(dateValue.getTime())) {
      throw new Error('Date invalide');
    }

    const payload = {
      id: data.id,
      title: data.title,
      date: dateValue.toISOString(),
      description: data.description,
      img: data.img,
      content: data.content,
      duration: data.duration || undefined,
      design: {
        mainColor: data.mainColor,
        secondColor: data.secondColor,
      },
      speakers: data.speakers || [],
      stakeholders: data.stakeholders || [],
      osMap: data.osMap || undefined,
    };

    await createConference.mutateAsync(payload);
    router.push('/admin/conferences');
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/conferences">
            <ArrowLeft className="mr-2 size-4" />
            Retour
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Nouvelle conférence
        </h1>
        <p className="text-muted-foreground mt-2">
          Créez une nouvelle conférence sur la plateforme
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <ConferenceForm
          onSubmit={handleSubmit}
          isSubmitting={createConference.isPending}
        />
      </div>
    </div>
  );
}
