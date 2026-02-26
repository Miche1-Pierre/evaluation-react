'use client';

import { useUsers, useChangeUserType, useDeleteUser } from '@/hooks/use-users';
import { useAuth } from '@/hooks/use-auth';
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
import { Shield, User, MoreHorizontal, Trash2, UserCog } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import type { User as UserType } from '@/types/user';

type ActionType = 'delete' | 'promote' | 'demote';

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const { user: currentUser } = useAuth();
  const changeUserType = useChangeUserType();
  const deleteUser = useDeleteUser();
  
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const handleAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      if (actionType === 'delete') {
        await deleteUser.mutateAsync(selectedUser.id);
      } else if (actionType === 'promote') {
        await changeUserType.mutateAsync({ id: selectedUser.id, newType: 'admin' });
      } else if (actionType === 'demote') {
        await changeUserType.mutateAsync({ id: selectedUser.id, newType: 'user' });
      }
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const openDialog = (user: UserType, action: ActionType) => {
    setSelectedUser(user);
    setActionType(action);
  };

  const getDialogContent = () => {
    if (!selectedUser || !actionType) return { title: '', description: '' };

    switch (actionType) {
      case 'delete':
        return {
          title: 'Supprimer l\'utilisateur',
          description: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${selectedUser.id}" ? Cette action est irréversible.`,
        };
      case 'promote':
        return {
          title: 'Promouvoir en administrateur',
          description: `Êtes-vous sûr de vouloir promouvoir "${selectedUser.id}" en administrateur ? Cet utilisateur aura accès à toutes les fonctionnalités d'administration.`,
        };
      case 'demote':
        return {
          title: 'Rétrograder en utilisateur',
          description: `Êtes-vous sûr de vouloir rétrograder "${selectedUser.id}" en utilisateur simple ? Cet utilisateur perdra tous ses privilèges d'administration.`,
        };
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
            {[...new Array(5)].map((_, i) => (
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
              {users.map((user) => {
                const isCurrentUser = currentUser?.id === user.id;
                
                return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {user.type === 'admin' ? (
                      <Shield className="size-4 text-primary" />
                    ) : (
                      <User className="size-4 text-muted-foreground" />
                    )}
                    {user.id}
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs">Vous</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.type === 'admin' ? 'default' : 'secondary'}
                    >
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {!isCurrentUser && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.type === 'user' ? (
                          <DropdownMenuItem onClick={() => openDialog(user, 'promote')}>
                            <Shield className="mr-2 size-4" />
                            Promouvoir admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => openDialog(user, 'demote')}>
                            <UserCog className="mr-2 size-4" />
                            Rétrograder user
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDialog(user, 'delete')}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!selectedUser && !!actionType} onOpenChange={(open) => {
        if (!open) {
          setSelectedUser(null);
          setActionType(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getDialogContent().title}</AlertDialogTitle>
            <AlertDialogDescription>
              {getDialogContent().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
