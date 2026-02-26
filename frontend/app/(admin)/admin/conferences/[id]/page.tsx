'use client';

import { ConferenceForm } from '@/components/admin/conferences/conference-form';
import {
  useConference,
  useUpdateConference,
} from '@/hooks/use-conferences';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditConferencePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: conference, isLoading } = useConference(params.id);
  const updateConference = useUpdateConference();

  const handleSubmit = async (data: any) => {
    const payload = {
      title: data.title,
      date: new Date(data.date).toISOString(),
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

    await updateConference.mutateAsync({ id: params.id, data: payload });
    router.push('/admin/conferences');
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!conference) {
    return (
      <div>
        <p className="text-destructive">Conférence introuvable</p>
      </div>
    );
  }

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
          Modifier la conférence
        </h1>
        <p className="text-muted-foreground mt-2">{conference.title}</p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <ConferenceForm
          conference={conference}
          onSubmit={handleSubmit}
          isSubmitting={updateConference.isPending}
        />
      </div>
    </div>
  );
}
