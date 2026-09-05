import Image from "next/image";
import SpotlightCard from "./SpotlightCard";
import MagneticLink from "./MagneticLink";

const ARTICLE_CLASSES =
  "relative flex h-[460px] w-full shrink-0 flex-col justify-end gap-6 overflow-hidden rounded-lg p-6 [scroll-snap-align:start] sm:h-[630px] sm:w-[90%] sm:p-12 lg:w-[1080px]";

export interface ProductSlide {
  image: string;
  alt: string;
  tagline?: string;
  title: string;
  price: string;
}

interface ProductSliderProps {
  slides: ProductSlide[];
  arrowSet?: "primary" | "secondary";
}

export default function ProductSlider({ slides, arrowSet = "primary" }: ProductSliderProps) {
  const backArrow = arrowSet === "primary" ? "/assets/icons/arrow-back.svg" : "/assets/icons/arrow-back2.svg";
  const forwardArrow =
    arrowSet === "primary" ? "/assets/icons/arrow-forward.svg" : "/assets/icons/arrow-forward2.svg";

  return (
    <section className="flex flex-col items-center bg-white px-5 py-16 sm:px-8 sm:py-18 lg:px-16 lg:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex w-full gap-12 overflow-x-auto [scroll-snap-type:x_mandatory]">
          {slides.map((slide) => (
            <SpotlightCard key={slide.title} spotlight="image" className={ARTICLE_CLASSES}>
              <Image src={slide.image} alt={slide.alt} fill className="-z-[1] object-cover" />
              <div className="relative z-[1] flex flex-col gap-2 text-white">
                {slide.tagline && <p className="text-base font-semibold">{slide.tagline}</p>}
                <h3 className="text-[36px] font-medium leading-tight tracking-tight sm:text-[52px]">{slide.title}</h3>
              </div>
              <div className="relative z-[1] flex flex-col gap-8">
                <p className="text-lg font-semibold text-white">{slide.price}</p>
                <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-center">
                  <MagneticLink href="#" variant="primary">
                    Одоо захиалах
                  </MagneticLink>
                  <MagneticLink href="#" variant="secondary">
                    Дэлгэрэнгүй
                  </MagneticLink>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <span
                key={slide.title}
                className={`h-2 w-2 rounded-full bg-[#020809] ${i === 0 ? "opacity-100" : "opacity-20"}`}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              aria-label="Previous"
              className="flex items-center justify-center rounded border border-white bg-[#f2f2f2] p-3"
            >
              <Image src={backArrow} alt="" width={24} height={24} />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="flex items-center justify-center rounded border border-white bg-[#f2f2f2] p-3"
            >
              <Image src={forwardArrow} alt="" width={24} height={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
