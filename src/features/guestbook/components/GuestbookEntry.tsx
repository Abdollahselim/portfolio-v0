interface GuestbookEntryProps {
  name: string;
  message: string;
}

export function GuestbookEntry({
  name,
  message,
}: GuestbookEntryProps): React.ReactElement {
  return (
    <article className="rounded-md border border-white/10 bg-[#111111] p-6">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="mt-3 text-gray-400">{message}</p>
    </article>
  );
}
