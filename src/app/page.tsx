import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FsdCard from "@/components/FsdCard";
import ProductSlider, { ProductSlide } from "@/components/ProductSlider";
import InfoRow from "@/components/InfoRow";
import MapSection from "@/components/MapSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const vehicleSlides: ProductSlide[] = [
  {
    image: "/assets/images/product-modely-l.png",
    alt: "Model Y L Premium",
    tagline: "Long Wheelbase Midsize SUV",
    title: "Model Y L Premium",
    price: "Starting at $61,990",
  },
  {
    image: "/assets/images/product-model3.png",
    alt: "Model 3",
    tagline: "Sport Sedan",
    title: "Model 3",
    price: "Lease From $419/mo",
  },
  {
    image: "/assets/images/product-modely.png",
    alt: "Model Y",
    tagline: "Midsize SUV",
    title: "Model Y",
    price: "Lease From $499/mo",
  },
];

const energySlides: ProductSlide[] = [
  {
    image: "/assets/images/product-solar.png",
    alt: "Solar Panels",
    title: "Solar Panels",
    price: "Power Your Home and Reduce Your Electricity Bil",
  },
  {
    image: "/assets/images/product-powerwall.png",
    alt: "Powerwall",
    title: "Powerwall",
    price: "Keep Your Lights On During Outages",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FsdCard />
      <ProductSlider slides={vehicleSlides} arrowSet="primary" />
      <InfoRow />
      <MapSection />
      <StatsSection />
      <ProductSlider slides={energySlides} arrowSet="secondary" />
      <Footer />
    </>
  );
}
