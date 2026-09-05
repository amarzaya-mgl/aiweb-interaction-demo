export const CAL_NAMESPACE = "document-beratung-20min";
export const CAL_LINK = "amarzaya-khashkhuu-zgwqcc/document-beratung-20min";
export const CAL_CONFIG = JSON.stringify({
  layout: "month_view",
  useSlotsViewOnSmallScreen: "true",
});

export function calTriggerProps() {
  return {
    "data-cal-link": CAL_LINK,
    "data-cal-namespace": CAL_NAMESPACE,
    "data-cal-config": CAL_CONFIG,
  } as const;
}
