import Image from "next/image";
import SpotlightCard from "./SpotlightCard";
import MagneticLink from "./MagneticLink";
import { calTriggerProps } from "@/lib/cal";

export default function FsdCard() {
  return (
    <section className="flex flex-col items-center bg-white px-5 py-16 sm:px-8 sm:py-18 lg:px-16 lg:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <SpotlightCard
          spotlight="light"
          className="flex w-full flex-col overflow-hidden rounded-lg bg-[#f2f2f2] lg:h-[480px] lg:flex-row"
        >
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-8 p-6 sm:p-12">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <h2 className="text-[32px] font-medium leading-tight tracking-tight sm:text-[44px]">
                  Full Self-Driving (Supervised)
                </h2>
                <p className="text-lg">Makes every drive easier. Subscribe for $99/mo.1</p>
              </div>
              <div className="flex flex-wrap gap-4 py-2 sm:flex-nowrap sm:gap-6">
                <div className="min-w-0 flex-1">
                  <p className="text-[36px] font-medium leading-[1.3] tracking-tight">7x</p>
                  <p className="text-base">Fewer Collisions</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[36px] font-medium leading-[1.3] tracking-tight">13,534,294,722</p>
                  <p className="text-base">Miles Driven</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-center">
              <MagneticLink href="#" variant="black" {...calTriggerProps()}>
                Жолоодож үзэх цаг авах
              </MagneticLink>
              <MagneticLink href="#" variant="secondary">
                Дэлгэрэнгүй
              </MagneticLink>
            </div>
          </div>
          <div className="relative min-h-[320px] min-w-0 flex-1">
            <Image
              src="/assets/images/fsd.png"
              alt="Full Self-Driving dashboard view"
              fill
              className="object-cover"
            />
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
