"use client";

import { useEffect, useCallback, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, trackEvent, configureAnalytics, AnalyticsEvents } from "@/lib/analytics";

/**
 * Props for AnalyticsProvider
 */
interface AnalyticsProviderProps {
  children: ReactNode;
  enabled?: boolean;
  debug?: boolean;
  endpoint?: string;
}

/**
 * Analytics Provider Component
 * 
 * Wraps the application to provide:
 * - Automatic page view tracking on route changes
 * - Initial page view on mount
 * - Runtime error capture
 * - Configuration of analytics settings
 */
export default function AnalyticsProvider({
  children,
  enabled = true,
  debug = process.env.NODE_ENV === "development",
  endpoint,
}: AnalyticsProviderProps): React.ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Configure analytics on mount
  useEffect(() => {
    configureAnalytics({
      enabled,
      debug,
      endpoint,
    });
  }, [enabled, debug, endpoint]);

  // Track page views on route changes
  useEffect(() => {
    if (!enabled) return;

    // Build full path with search params
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Track page view
    trackPageView(url, document.title);

    if (debug) {
      console.log("[Analytics] Page view tracked:", url);
    }
  }, [pathname, searchParams, enabled, debug]);

  // Global error handler for runtime errors
  const handleError = useCallback(
    (event: ErrorEvent) => {
      if (!enabled) return;

      trackEvent(AnalyticsEvents.ERROR_RUNTIME, {
        error_message: event.message,
        error_stack: event.error?.stack,
        error_name: event.error?.name || "Error",
        page_path: typeof window !== "undefined" ? window.location.pathname : "",
      });

      if (debug) {
        console.log("[Analytics] Runtime error tracked:", event.message);
      }
    },
    [enabled, debug]
  );

  // Global handler for unhandled promise rejections
  const handleUnhandledRejection = useCallback(
    (event: PromiseRejectionEvent) => {
      if (!enabled) return;

      const error = event.reason;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorName = error instanceof Error ? error.name : "UnhandledRejection";

      trackEvent(AnalyticsEvents.ERROR_RUNTIME, {
        error_message: errorMessage,
        error_stack: errorStack,
        error_name: errorName,
        page_path: typeof window !== "undefined" ? window.location.pathname : "",
      });

      if (debug) {
        console.log("[Analytics] Unhandled rejection tracked:", errorMessage);
      }
    },
    [enabled, debug]
  );

  // Set up global error listeners
  useEffect(() => {
    if (typeof window === "undefined" || !enabled) return;

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [enabled, handleError, handleUnhandledRejection]);

  return <>{children}</>;
}
