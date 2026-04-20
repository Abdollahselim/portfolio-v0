"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { ContactFormSchema, type ContactFormData } from "@/schemas";

type ContactFormFields = ContactFormData;

export function ContactForm(): React.ReactElement {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
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
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      if (fieldErrors.name?.[0]) {
        setError("name", { message: fieldErrors.name[0] });
      }

      if (fieldErrors.email?.[0]) {
        setError("email", { message: fieldErrors.email[0] });
      }

      if (fieldErrors.message?.[0]) {
        setError("message", { message: fieldErrors.message[0] });
      }

      setStatusMessage("Please review the highlighted fields.");
      return;
    }

    setStatusMessage("Message validated locally. No data was sent.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register("name")} />
        {errors.name?.message && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email?.message && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" {...register("message")} />
        {errors.message?.message && <p>{errors.message.message}</p>}
      </div>

      <button type="submit">Validate message</button>
      {statusMessage && <p>{statusMessage}</p>}
    </form>
  );
}
