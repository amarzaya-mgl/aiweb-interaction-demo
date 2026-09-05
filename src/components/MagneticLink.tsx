"use client";

import { AnchorHTMLAttributes, ReactNode } from "react";
import { useMagneticButton } from "@/hooks/useMagneticButton";

type Variant = "primary" | "black" | "secondary";

const variantClasses: Record<Variant, string> = {
  primary: "bg-royal-blue border-royal-blue text-white",
  black: "bg-black border-black text-white",
  secondary: "bg-white border-transparent text-neutral-darkest",
};

interface MagneticLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

export default function MagneticLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: MagneticLinkProps) {
  const ref = useMagneticButton<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md border px-6 py-2.5 text-base font-medium will-change-transform motion-reduce:!transform-none ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
