import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export function Container({ children }: ContainerProps): React.ReactElement {
  return <div className="min-h-screen w-full">{children}</div>;
}
