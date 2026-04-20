import { GuestbookList } from "@/features/guestbook";

export default function GuestbookPage(): React.ReactElement {
  return (
    <main className="py-10">
      <h1>Guestbook</h1>
      <GuestbookList />
    </main>
  );
}
