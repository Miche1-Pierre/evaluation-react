import Image from "next/image";

export function Logo({ className }: { readonly className?: string }) {
  return (
    <a href="#" className="flex items-center gap-2 font-medium">
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <Image
          src="/axiom_dark.svg"
          alt="Logo"
          width={16}
          height={16}
          className={`dark:invert ${className}`}
        />
      </div>
      <span className="text-lg">AXIOM</span>
    </a>
  );
}
