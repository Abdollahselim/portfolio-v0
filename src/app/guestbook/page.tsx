import { GuestbookList } from "@/features/guestbook";

export default function GuestbookPage(): React.ReactElement {
  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">
          Guestbook
        </p>
        <h1 className="mt-3 text-4xl font-bold">Wall of notes</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          Static mock entries for the future interactive guestbook.
        </p>
        <div className="mt-10">
          <GuestbookList />
        </div>
      </div>
    </main>
  );
}
