'use client';

import { useUsers, usePromoteUser } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const promoteUser = usePromoteUser();
  const [promoteId, setPromoteId] = useState<string | null>(null);

  const handlePromote = async () => {
    if (promoteId) {
      await promoteUser.mutateAsync(promoteId);
      setPromoteId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les utilisateurs et leurs permissions
        </p>
      </div>

      <div className="bg-card rounded-lg border">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !users || users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identifiant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {user.type === 'admin' ? (
                      <Shield className="size-4 text-primary" />
                    ) : (
                      <User className="size-4 text-muted-foreground" />
                    )}
                    {user.id}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.type === 'admin' ? 'default' : 'secondary'}
                    >
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.type === 'user' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPromoteId(user.id)}
                      >
                        <Shield className="mr-2 size-4" />
                        Promouvoir admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!promoteId} onOpenChange={() => setPromoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promouvoir en administrateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'utilisateur <strong>{promoteId}</strong> obtiendra les droits
              d'administration et pourra gérer les conférences et utilisateurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handlePromote}>
              Promouvoir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
