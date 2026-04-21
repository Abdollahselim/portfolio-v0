import type { Metadata } from "next";
import { ContactForm } from "@/features/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Abdullah Selim for e-commerce development projects and collaborations.",
};

export default function ContactPage(): React.ReactElement {
  return (
    <main className="px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#10b981]">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-bold">Start a conversation</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-400">
          This form validates locally only. No data is sent anywhere.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
