import type { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
}

export function Heading({ children }: TypographyProps): React.ReactElement {
  return <h1 className="text-3xl font-bold">{children}</h1>;
}

export function Paragraph({ children }: TypographyProps): React.ReactElement {
  return <p className="text-base leading-7">{children}</p>;
}

export function SmallText({ children }: TypographyProps): React.ReactElement {
  return <p className="text-sm">{children}</p>;
}
