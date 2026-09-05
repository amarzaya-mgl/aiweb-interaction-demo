import Image from "next/image";
import MagneticLink from "./MagneticLink";

export default function Hero() {
  return (
    <section className="relative flex min-h-[560px] justify-center overflow-hidden px-5 pt-16 sm:min-h-[700px] sm:px-8 lg:min-h-[900px] lg:px-16">
      <Image
        src="/assets/images/hero-model3.png"
        alt="Tesla Model 3"
        fill
        priority
        className="-z-10 object-cover"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8">
        <div className="flex w-full max-w-3xl flex-col items-center gap-6 text-center text-white">
          <h1 className="text-[44px] font-medium leading-tight tracking-tight sm:text-[48px] lg:text-[72px]">
            Model 3
          </h1>
          <p className="text-lg font-normal">1.99% APR Available</p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <MagneticLink href="#" variant="primary" className="w-full sm:w-auto">
            Одоо захиалах
          </MagneticLink>
          <MagneticLink href="#" variant="secondary" className="w-full sm:w-auto">
            Дэлгэнгүй үзэх
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
