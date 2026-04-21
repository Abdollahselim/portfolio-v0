import Link from "next/link";

export function Navbar(): React.ReactElement {
  return (
    <header className="border-b border-white/10">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5"
      >
        <Link className="font-semibold text-[#ededed]" href="/">
          Abdullah Selim
        </Link>
        <div className="flex gap-4 text-sm text-gray-400">
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
