type AnalyticsValue = string | number | boolean | null | undefined;

export type TrackableEventName =
  | "page_view"
  | "waitlist_submit_attempt"
  | "waitlist_submit_success"
  | "waitlist_submit_error"
  | "waitlist_survey_success"
  | "waitlist_email_success"
  | "waitlist_survey_complete"
  | "sample_briefing_click"
  | "hero_cta_click"
  | "faq_expand";

export type AnalyticsProps = Record<string, AnalyticsValue>;

type MetaStandardEventName = "Lead" | "CompleteRegistration";

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: TrackableEventName,
      eventParameters?: AnalyticsProps,
    ) => void;
    plausible?: (
      eventName: TrackableEventName,
      options?: { props?: AnalyticsProps },
    ) => void;
    fbq?: (
      command: "track",
      eventName: MetaStandardEventName,
      eventParameters?: AnalyticsProps,
    ) => void;
  }
}

export function trackEvent(
  eventName: TrackableEventName,
  props?: AnalyticsProps,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const eventProps = props ?? {};
  let tracked = false;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventProps);
    tracked = true;
  }

  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props: eventProps });
    tracked = true;
  }

  if (!tracked && process.env.NODE_ENV === "development") {
    console.info("[analytics]", eventName, eventProps);
  }
}

export function trackMetaEvent(
  eventName: MetaStandardEventName,
  props?: AnalyticsProps,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, props ?? {});
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[meta]", eventName, props ?? {});
  }
}
