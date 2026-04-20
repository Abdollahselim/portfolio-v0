import { GuestbookEntry } from "./GuestbookEntry";

const guestbookEntries = [
  {
    name: "Ada Lovelace",
    message: "A thoughtful foundation for a developer system.",
  },
  {
    name: "Grace Hopper",
    message: "Clear structure makes future work easier to reason about.",
  },
] as const;

export function GuestbookList(): React.ReactElement {
  return (
    <div>
      {guestbookEntries.map((entry) => (
        <GuestbookEntry
          key={`${entry.name}-${entry.message}`}
          name={entry.name}
          message={entry.message}
        />
      ))}
    </div>
  );
}
