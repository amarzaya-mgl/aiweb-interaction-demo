"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import SpotlightCard from "./SpotlightCard";
import MagneticButton from "./MagneticButton";

interface FormValues {
  name: string;
  email: string;
  phone: string;
}

const initialValues: FormValues = { name: "", email: "", phone: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{8,}$/;

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {};
  if (!values.name.trim()) {
    errors.name = "Нэрээ оруулна уу.";
  }
  if (!values.email.trim()) {
    errors.email = "Имэйл хаягаа оруулна уу.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Имэйл хаяг буруу байна.";
  }
  if (!values.phone.trim()) {
    errors.phone = "Утасны дугаараа оруулна уу.";
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Утасны дугаар буруу байна.";
  }
  return errors;
}

const fieldClasses =
  "w-full rounded-md border border-[rgba(2,8,9,0.15)] bg-white px-4 py-3 text-base text-neutral-darkest placeholder:text-[rgba(2,8,9,0.4)] outline-none transition-colors focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20";

const errorFieldClasses = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof FormValues) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setValues(initialValues);
    }
  }

  return (
    <SpotlightCard
      spotlight="light"
      className="flex w-full flex-col overflow-hidden rounded-lg bg-[#f2f2f2] lg:flex-row"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-6 p-6 sm:p-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-[28px] font-medium leading-snug tracking-tight sm:text-[36px]">
            Бидэнтэй холбогдох
          </h3>
          <p className="text-base">
            Мэдээлэл үлдээвэл манай төлөөлөгч тантай удахгүй холбогдох болно.
          </p>
        </div>

        {submitted && (
          <div
            role="status"
            className="rounded-md border border-royal-blue/30 bg-royal-blue/10 px-4 py-3 text-sm font-medium text-royal-blue"
          >
            Баярлалаа! Таны хүсэлтийг хүлээн авлаа.
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className="text-sm font-medium">
              Харилцагчийн нэр
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Бат-Эрдэнэ"
              value={values.name}
              onChange={handleChange("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={`${fieldClasses} ${errors.name ? errorFieldClasses : ""}`}
            />
            {errors.name && (
              <p id="contact-name-error" className="text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className="text-sm font-medium">
              Имэйл хаяг
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={values.email}
              onChange={handleChange("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={`${fieldClasses} ${errors.email ? errorFieldClasses : ""}`}
            />
            {errors.email && (
              <p id="contact-email-error" className="text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-phone" className="text-sm font-medium">
              Утасны дугаар
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="9911 2233"
              value={values.phone}
              onChange={handleChange("phone")}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "contact-phone-error" : undefined}
              className={`${fieldClasses} ${errors.phone ? errorFieldClasses : ""}`}
            />
            {errors.phone && (
              <p id="contact-phone-error" className="text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="flex pt-2">
            <MagneticButton type="submit" variant="primary" className="w-full sm:w-auto">
              Илгээх
            </MagneticButton>
          </div>
        </form>
      </div>

      <div className="hidden min-w-0 flex-1 items-center bg-[#020809] lg:flex">
        <div className="flex h-full w-full flex-col justify-center gap-6 p-10 text-white">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Байршил</p>
            <p className="text-lg">Улаанбаатар хот, Сүхбаатар дүүрэг</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Утас</p>
            <p className="text-lg">+976 9911 2233</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Имэйл</p>
            <p className="text-lg">contact@tesla-demo.mn</p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
