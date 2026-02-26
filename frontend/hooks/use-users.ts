import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user-service";

export const userKeys = {
  all: ["users"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: userService.getAll,
  });
}

export function usePromoteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.promoteToAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useChangeUserType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newType }: { id: string; newType: "admin" | "user" }) =>
      userService.changeType(id, newType),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}
