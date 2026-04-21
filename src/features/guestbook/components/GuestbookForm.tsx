"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { GuestbookSchema, type GuestbookFormData } from "@/schemas";
import { addGuestbookEntry } from "../services/guestbook.service";

export function GuestbookForm(): React.ReactElement {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<GuestbookFormData>();

  function handleValidSubmit(data: GuestbookFormData): void {
    const validated = GuestbookSchema.safeParse(data);

    if (!validated.success) {
      const fieldErrors = validated.error.flatten((i) => i.message).fieldErrors;
      if (fieldErrors.name?.[0]) setError("name", { message: fieldErrors.name[0] });
      if (fieldErrors.message?.[0]) setError("message", { message: fieldErrors.message[0] });
      return;
    }

    startTransition(async () => {
      const result = await addGuestbookEntry(validated.data);

      if (result.success) {
        setStatusMessage("Entry added!");
        setIsSuccess(true);
        reset();
        router.refresh();
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
        <label htmlFor="gb-name">Name</label>
        <input
          className="mt-2 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-4 py-3"
          id="gb-name"
          type="text"
          {...register("name")}
        />
        {errors.name?.message && (
          <p className="mt-2 text-sm text-red-300">{errors.name.message}</p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="gb-message">Message</label>
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-4 py-3"
          id="gb-message"
          {...register("message")}
        />
        {errors.message?.message && (
          <p className="mt-2 text-sm text-red-300">{errors.message.message}</p>
        )}
      </div>

      <button
        className="mt-6 rounded-md bg-[#10b981] px-5 py-3 font-semibold text-black disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Adding…" : "Leave a note"}
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
