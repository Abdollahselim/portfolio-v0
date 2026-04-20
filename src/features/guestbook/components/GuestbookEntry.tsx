interface GuestbookEntryProps {
  name: string;
  message: string;
}

export function GuestbookEntry({
  name,
  message,
}: GuestbookEntryProps): React.ReactElement {
  return (
    <article>
      <h2>{name}</h2>
      <p>{message}</p>
    </article>
  );
}
