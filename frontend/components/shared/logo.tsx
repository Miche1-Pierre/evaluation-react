import Image from "next/image";
import Link from "next/link";

export function Logo({ 
  className,
  asChild = false 
}: { 
  readonly className?: string;
  readonly asChild?: boolean;
}) {
  const content = (
    <>
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
    </>
  );

  if (asChild) {
    return <div className="flex items-center gap-2 font-medium">{content}</div>;
  }

  return (
    <Link href="/" className="flex items-center gap-2 font-medium">
      {content}
    </Link>
  );
}
