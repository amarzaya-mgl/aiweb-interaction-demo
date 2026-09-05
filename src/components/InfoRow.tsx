import Image from "next/image";
import SpotlightCard from "./SpotlightCard";
import MagneticLink from "./MagneticLink";
import InventoryTabs from "./InventoryTabs";

export default function InfoRow() {
  return (
    <section className="flex flex-col items-center bg-white px-5 py-16 sm:px-8 sm:py-18 lg:px-16 lg:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <SpotlightCard
          spotlight="light"
          className="flex flex-1 flex-col overflow-hidden rounded-lg bg-[#f2f2f2] sm:flex-row"
        >
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-6 p-5 sm:p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[28px] font-medium leading-snug tracking-tight">Current Offers</h3>
              <p className="text-base">Explore limited-time offers on Tesla vehicles.</p>
            </div>
            <div className="flex items-center">
              <MagneticLink href="#" variant="secondary">
                Дэлгэрэнгүй
              </MagneticLink>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 items-center">
            <Image
              src="/assets/images/offers-cars.png"
              alt="Tesla vehicle lineup"
              width={600}
              height={320}
              className="h-[240px] w-full object-cover sm:h-[320px]"
            />
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlight="light"
          className="flex flex-1 flex-col overflow-hidden rounded-lg bg-[#f2f2f2] sm:flex-row"
        >
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-6 p-5 sm:p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[28px] font-medium leading-snug tracking-tight">Inventory</h3>
              <p className="text-base">Find new and Certified Pre-Owned Tesla vehicles available immediately.</p>
            </div>
            <InventoryTabs />
          </div>
          <div
            className="flex min-w-0 flex-1 items-center"
            id="inventory-panel"
            role="tabpanel"
            aria-labelledby="inventory-tab-new"
          >
            <Image
              src="/assets/images/inventory-cars.png"
              alt="Tesla vehicle inventory"
              width={600}
              height={320}
              className="h-[240px] w-full object-cover sm:h-[320px]"
            />
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
