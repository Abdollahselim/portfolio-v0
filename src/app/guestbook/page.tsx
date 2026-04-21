import type { Metadata } from "next";
import {
  GuestbookForm,
  GuestbookList,
  getGuestbookEntries,
} from "@/features/guestbook";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Leave a note for Abdullah Selim's portfolio guestbook.",
};

export const revalidate = 60;

export default async function GuestbookPage(): Promise<React.ReactElement> {
  const result = await getGuestbookEntries();

  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">
          Guestbook
        </p>
        <h1 className="mt-3 text-4xl font-bold">Wall of notes</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          Leave a note — thoughts, feedback, or a hello.
        </p>

        <div className="mt-10">
          <GuestbookForm />
        </div>

        <div className="mt-12">
          {result.success ? (
            <GuestbookList entries={result.data} />
          ) : (
            <p className="text-gray-400">Unable to load entries.</p>
          )}
        </div>
      </div>
    </main>
  );
}
