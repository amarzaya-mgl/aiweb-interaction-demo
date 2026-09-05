"use client";

import { HTMLAttributes, ReactNode } from "react";
import { useSpotlightHover } from "@/hooks/useSpotlightHover";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  spotlight?: "light" | "image";
  children: ReactNode;
}

const spotOpacity: Record<"light" | "image", string> = {
  light: "0.08",
  image: "0.16",
};

export default function SpotlightCard({
  spotlight = "light",
  className = "",
  style,
  children,
  ...props
}: SpotlightCardProps) {
  const ref = useSpotlightHover<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`spotlight-card relative ${className}`}
      style={{ ["--spot-opacity" as string]: spotOpacity[spotlight], ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
