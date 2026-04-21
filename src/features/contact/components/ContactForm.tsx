"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { ContactFormSchema, type ContactFormData } from "@/schemas";
import { submitContact } from "../services/contact.service";

type ContactFormFields = ContactFormData;

export function ContactForm(): React.ReactElement {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ContactFormFields>();

  function handleValidSubmit(data: ContactFormFields): void {
    const validationResult = ContactFormSchema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten((i) => i.message).fieldErrors;

      if (fieldErrors.name?.[0]) setError("name", { message: fieldErrors.name[0] });
      if (fieldErrors.email?.[0]) setError("email", { message: fieldErrors.email[0] });
      if (fieldErrors.subject?.[0]) setError("subject", { message: fieldErrors.subject[0] });
      if (fieldErrors.message?.[0]) setError("message", { message: fieldErrors.message[0] });

      setStatusMessage("Please review the highlighted fields.");
      setIsSuccess(false);
      return;
    }

    startTransition(async () => {
      const result = await submitContact(validationResult.data);

      if (result.success) {
        setStatusMessage("Message sent! I'll be in touch soon.");
        setIsSuccess(true);
        reset();
      } else {
        setStatusMessage(result.error);
        setIsSuccess(false);
      }
    });
  }

  return (
    <form
      className="rounded-md border border-white/10 bg-[#111111] p-6"
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <div>
        <label htmlFor="name">Name</label>
        <input
          className="mt-2 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-4 py-3"
          id="name"
          type="text"
          {...register("name")}
        />
        {errors.name?.message && (
          <p className="mt-2 text-sm text-red-300">{errors.name.message}</p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="email">Email</label>
        <input
          className="mt-2 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-4 py-3"
          id="email"
          type="email"
          {...register("email")}
        />
        {errors.email?.message && (
          <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="subject">Subject</label>
        <input
          className="mt-2 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-4 py-3"
          id="subject"
          type="text"
          {...register("subject")}
        />
        {errors.subject?.message && (
          <p className="mt-2 text-sm text-red-300">{errors.subject.message}</p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="message">Message</label>
        <textarea
          className="mt-2 min-h-36 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-4 py-3"
          id="message"
          {...register("message")}
        />
        {errors.message?.message && (
          <p className="mt-2 text-sm text-red-300">{errors.message.message}</p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="budget">Budget (optional)</label>
        <input
          className="mt-2 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-4 py-3"
          id="budget"
          type="text"
          {...register("budget")}
        />
      </div>

      <button
        className="mt-6 rounded-md bg-[#10b981] px-5 py-3 font-semibold text-black disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Sending…" : "Send message"}
      </button>

      {statusMessage && (
        <p
          className={`mt-4 text-sm ${isSuccess ? "text-emerald-400" : "text-red-300"}`}
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}
