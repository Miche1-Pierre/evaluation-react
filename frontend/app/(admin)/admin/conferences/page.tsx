"use client";

import { useConferences, useDeleteConference } from "@/hooks/use-conferences";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ConferencesPage() {
  const { data: conferences, isLoading } = useConferences();
  const deleteConference = useDeleteConference();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteConference.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conférences</h1>
          <p className="text-muted-foreground mt-2">
            Gérez toutes les conférences de la plateforme
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/conferences/new">
            <Plus className="mr-2 size-4" />
            Nouvelle conférence
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !conferences || conferences.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Aucune conférence pour le moment
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Couleurs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conferences.map((conference) => (
                <TableRow key={conference.id}>
                  <TableCell className="font-medium">
                    {conference.title}
                  </TableCell>
                  <TableCell>
                    {format(new Date(conference.date), "dd MMM yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>{conference.duration || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <div
                        className="size-6 rounded border"
                        style={{ backgroundColor: conference.design.mainColor }}
                        title={conference.design.mainColor}
                      />
                      <div
                        className="size-6 rounded border"
                        style={{
                          backgroundColor: conference.design.secondColor,
                        }}
                        title={conference.design.secondColor}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/conferences/${conference.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(conference.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La conférence sera définitivement
              supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
