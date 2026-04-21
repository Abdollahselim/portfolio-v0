export function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4 text-sm text-gray-400">
            <a
              className="transition-colors hover:text-[#ededed]"
              href="https://github.com/Abdollahselim"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            <a
              className="transition-colors hover:text-[#ededed]"
              href="https://www.linkedin.com/in/abdullahselim"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </div>
          <div className="space-y-1 text-sm text-gray-400 sm:text-right">
            <p>© 2026 Abdullah Selim. All rights reserved.</p>
            <p>Built with Next.js · Deployed on Vercel</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
