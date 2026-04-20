import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export function Container({ children }: ContainerProps): React.ReactElement {
  return <div className="mx-auto w-full max-w-5xl px-4">{children}</div>;
}
