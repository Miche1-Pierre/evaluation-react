'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";

const registerSchema = z.object({
  id: z.string()
    .min(3, "L'identifiant doit contenir au moins 3 caractères")
    .regex(/^[a-z0-9_-]+$/, "Uniquement lettres minuscules, chiffres, tirets et underscores"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setError(null);
    try {
      await api.post('/signup', {
        id: values.id,
        password: values.password,
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      if (err.status === 409) {
        setError("Cet identifiant est déjà utilisé.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3">
          <p className="text-green-500 font-medium">
            ✓ Compte créé avec succès !
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Redirection vers la page de connexion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Rejoignez Axiom pour découvrir les meilleures conférences tech
          </p>
        </div>

        {error && (
          <p className="text-destructive text-sm text-center rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
            {error}
          </p>
        )}

        <Field>
          <FieldLabel htmlFor="id">Identifiant</FieldLabel>
          <Input 
            id="id" 
            placeholder="votre_identifiant" 
            autoComplete="username" 
            {...register("id")} 
          />
          {errors.id && (
            <p className="text-destructive text-xs mt-1">{errors.id.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input 
            id="password" 
            type="password" 
            autoComplete="new-password" 
            {...register("password")} 
          />
          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
          <Input 
            id="confirmPassword" 
            type="password" 
            autoComplete="new-password" 
            {...register("confirmPassword")} 
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="size-4 mr-2" />}
            {isSubmitting ? "Création..." : "Créer mon compte"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
