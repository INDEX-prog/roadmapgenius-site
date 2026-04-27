/**
 * Analytics Module Entry Point
 * 
 * Re-exports all analytics functionality for easy importing.
 */

// Schema & Types
export {
  AnalyticsEvents,
  type AnalyticsEventName,
  type AnalyticsEventMap,
  type AnalyticsEventPayload,
  type EventProperties,
  type BaseEventProperties,
  type PageViewProperties,
  type CTAClickProperties,
  type SignupStartProperties,
  type SignupSubmitProperties,
  type SignupSuccessProperties,
  type SignupErrorProperties,
  type PricingToggleProperties,
  type PricingPlanSelectProperties,
  type FAQExpandProperties,
  type FAQCollapseProperties,
  type ActivationStepViewProperties,
  type ActivationStepCompleteProperties,
  type ActivationCompleteProperties,
  type FirstRoadmapStartProperties,
  type FirstRoadmapCompleteProperties,
  type RuntimeErrorProperties,
  type ErrorBoundaryCaughtProperties,
  type FeatureViewProperties,
  type TestimonialViewProperties,
} from './schema';

// Core Functions
export {
  configureAnalytics,
  trackEvent,
  trackPageView,
  getStoredEvents,
  clearStoredEvents,
  identifyUser,
} from './core';

// React Hooks
export {
  usePageView,
  useCTAClick,
  useSignupTracking,
  usePricingTracking,
  useFAQTracking,
  useActivationTracking,
  useErrorTracking,
  useFeatureViewTracking,
} from './hooks';
