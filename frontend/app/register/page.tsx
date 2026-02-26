import { RegisterForm } from "@/components/login/register-form";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
        <p className="text-center text-muted-foreground text-xs space-x-2">
          <Link href="/" className="hover:text-foreground underline underline-offset-4 transition-colors">
            ← Retour à l&apos;accueil
          </Link>
          <span>•</span>
          <Link href="/login" className="hover:text-foreground underline underline-offset-4 transition-colors">
            Déjà un compte ? Se connecter
          </Link>
        </p>
      </div>

      {/* Right — decorative panel */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/80 via-card to-background" />
        <div className="relative z-10 text-center px-10">
          <div className="flex items-center justify-center gap-3 mb-6 scale-150">
            <Logo />
          </div>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Rejoignez la communauté tech.<br />
            Sauvegardez vos conférences préférées.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 size-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-primary/15 blur-3xl" />
      </div>
    </div>
  );
}
