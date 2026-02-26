'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      await login(values.id, values.password);
      
      // After login, check user type from the store
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.type === 'admin') {
        router.push('/admin/conferences');
      } else {
        router.push('/');
      }
    } catch {
      setError("Identifiant ou mot de passe incorrect.");
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>

        {error && (
          <p className="text-destructive text-sm text-center rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
            {error}
          </p>
        )}

        <Field>
          <FieldLabel htmlFor="id">Identifiant</FieldLabel>
          <Input id="id" placeholder="votre_identifiant" autoComplete="username" {...register("id")} />
          {errors.id && (
            <p className="text-destructive text-xs mt-1">{errors.id.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="size-4 mr-2" />}
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </Button>
        </Field>

        <p className="text-center text-muted-foreground text-xs">
          Pas encore de compte ?{' '}
          <a href="/register" className="text-foreground hover:underline underline-offset-4 transition-colors">
            Créer un compte
          </a>
        </p>
      </FieldGroup>
    </form>
  );
}
