import Link from "next/link";

export function Navbar(): React.ReactElement {
  return (
    <header className="border-b">
      <nav aria-label="Main navigation" className="py-4">
        <Link href="/">Portfolio Pro</Link>
      </nav>
    </header>
  );
}
