import Image from "next/image";
import MagneticLink from "./MagneticLink";
import { calTriggerProps } from "@/lib/cal";

const navLinks = ["Vehicles", "Energy", "Charging", "Discover", "Shop"];

export default function Navbar() {
  return (
    <header className="flex flex-col items-center justify-center bg-white px-5 sm:px-8 lg:px-16">
      <div className="flex w-full items-center justify-center gap-8 py-4">
        <div className="min-w-0 flex-1">
          <Image src="/assets/images/logo.png" alt="Tesla" width={120} height={14} className="h-3.5 w-auto sm:h-3.5" />
        </div>
        <nav className="hidden shrink-0 items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a key={link} href="#" className="whitespace-nowrap text-base font-normal">
              {link}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 justify-end">
          <MagneticLink href="#" variant="primary" className="px-5 py-2" {...calTriggerProps()}>
            Жолоодож үзэх
          </MagneticLink>
        </div>
      </div>
    </header>
  );
}
