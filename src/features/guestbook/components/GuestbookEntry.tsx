import { formatRelativeDate } from "@/lib/utils";

interface GuestbookEntryProps {
  name: string;
  message: string;
  createdAt: string;
}

export function GuestbookEntry({
  name,
  message,
  createdAt,
}: GuestbookEntryProps): React.ReactElement {
  return (
    <article className="rounded-md border border-white/10 bg-[#111111] p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <time
          className="shrink-0 text-xs text-gray-500"
          dateTime={createdAt}
        >
          {formatRelativeDate(createdAt)}
        </time>
      </div>
      <p className="mt-3 text-gray-400">{message}</p>
    </article>
  );
}
