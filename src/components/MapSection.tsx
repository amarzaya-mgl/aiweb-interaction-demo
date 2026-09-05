import Image from "next/image";
import ContactForm from "./ContactForm";

export default function MapSection() {
  return (
    <section className="flex flex-col items-center bg-white px-5 py-16 sm:px-8 sm:py-18 lg:px-16 lg:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="overflow-hidden rounded-lg">
          <Image
            src="/assets/images/map.png"
            alt="Map of Tesla Supercharger and Destination Charger locations across the United States"
            width={1280}
            height={720}
            className="h-[320px] w-full object-cover sm:h-[480px] lg:h-[720px]"
          />
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
