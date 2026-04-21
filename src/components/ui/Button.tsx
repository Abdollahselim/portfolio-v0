import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  onClick?: () => void;
}

const buttonClassNames: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center rounded-md bg-[#10b981] px-5 py-3 font-semibold text-black transition hover:bg-emerald-300",
  ghost:
    "inline-flex items-center justify-center rounded-md border border-white/10 px-5 py-3 font-semibold text-[#ededed] transition hover:border-[#10b981] hover:text-[#10b981]",
};

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
}: ButtonProps): React.ReactElement {
  if (href) {
    return (
      <Link className={buttonClassNames[variant]} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassNames[variant]} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
