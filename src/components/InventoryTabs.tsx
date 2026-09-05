"use client";

import { useMorphingTabs } from "@/hooks/useMorphingTabs";

export default function InventoryTabs() {
  const tablistRef = useMorphingTabs<HTMLDivElement>();

  return (
    <div
      ref={tablistRef}
      className="tabs info-card__actions--multi flex items-center gap-2 sm:flex-col sm:items-stretch sm:gap-2"
      role="tablist"
      aria-label="Inventory filter"
    >
      <span className="tabs__indicator" aria-hidden="true" />
      <button
        type="button"
        className="tabs__tab inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-white px-6 py-2.5 text-base font-medium text-neutral-darkest"
        role="tab"
        id="inventory-tab-new"
        aria-controls="inventory-panel"
        aria-selected="true"
        tabIndex={0}
        data-tab="new"
      >
        <span className="tabs__label">New</span>
      </button>
      <button
        type="button"
        className="tabs__tab inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-white px-6 py-2.5 text-base font-medium text-neutral-darkest"
        role="tab"
        id="inventory-tab-pre-owned"
        aria-controls="inventory-panel"
        aria-selected="false"
        tabIndex={-1}
        data-tab="pre-owned"
      >
        <span className="tabs__label">Pre-Owned</span>
      </button>
    </div>
  );
}
