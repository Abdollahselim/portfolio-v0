import type { GuestbookEntry as GuestbookEntryData } from "@/lib/db/types";
import { GuestbookEntry } from "./GuestbookEntry";

interface GuestbookListProps {
  entries: GuestbookEntryData[];
}

export function GuestbookList({
  entries,
}: GuestbookListProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <p className="text-gray-400">
        No entries yet. Be the first to leave a note.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {entries.map((entry) => (
        <GuestbookEntry
          key={entry.id}
          createdAt={entry.created_at}
          message={entry.message}
          name={entry.name}
        />
      ))}
    </div>
  );
}
