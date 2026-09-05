import Image from "next/image";
import MagneticLink from "./MagneticLink";

const stats = [
  { value: "38,490", label: "Superchargers", icon: "/assets/icons/stat-supercharger.svg" },
  { value: "410", label: "Destination Chargers", icon: "/assets/icons/stat-destination.svg" },
];

export default function StatsSection() {
  return (
    <section className="flex flex-col items-center bg-[#f2f2f2] px-5 py-16 sm:px-8 sm:py-18 lg:px-16 lg:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex w-full shrink-0 flex-col gap-8 lg:w-[616px]">
          <div className="flex flex-col gap-6">
            <h2 className="text-[36px] font-medium leading-tight tracking-tight sm:text-[52px]">
              Find Your Charge
            </h2>
            <p className="text-lg">
              View the network of Tesla Superchargers and Destination Chargers available near you.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-center">
            <MagneticLink href="#" variant="black">
              View Network
            </MagneticLink>
            <MagneticLink href="#" variant="secondary">
              Дэлгэрэнгүй
            </MagneticLink>
          </div>
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex min-w-0 flex-col gap-2 border-l border-[rgba(2,8,9,0.15)] pl-8"
            >
              <div className="flex items-center gap-2.5">
                <p className="text-[52px] font-medium leading-tight tracking-tight">{stat.value}</p>
                <Image src={stat.icon} alt="" width={56} height={56} />
              </div>
              <p className="text-[22px] font-medium leading-snug tracking-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
