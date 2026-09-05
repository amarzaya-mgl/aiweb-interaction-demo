"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { useMagneticButton } from "@/hooks/useMagneticButton";

type Variant = "primary" | "black" | "secondary";

const variantClasses: Record<Variant, string> = {
  primary: "bg-royal-blue border-royal-blue text-white",
  black: "bg-black border-black text-white",
  secondary: "bg-white border-transparent text-neutral-darkest",
};

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export default function MagneticButton({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: MagneticButtonProps) {
  const ref = useMagneticButton<HTMLButtonElement>();

  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md border px-6 py-2.5 text-base font-medium will-change-transform motion-reduce:!transform-none ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
