import Link from "next/link";

export default function NotFound(): React.ReactElement {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">404</p>
      <h1 className="mt-3 text-4xl font-bold text-[#ededed]">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8">
        <Link
          className="rounded-md border border-white/10 bg-[#111111] px-5 py-2.5 text-sm font-medium text-[#ededed] transition-colors hover:bg-[#1a1a1a]"
          href="/"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
