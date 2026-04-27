/**
 * Analytics Event Schema for RoadmapGenius
 * 
 * This module defines all analytics event names and their required properties.
 * Use this schema to ensure consistent event tracking across the application.
 */

// ============================================================================
// Event Names - Centralized event name constants
// ============================================================================

export const AnalyticsEvents = {
  // Page & Navigation Events
  PAGE_VIEW: 'page_view',
  
  // CTA Click Events
  CTA_CLICK: 'cta_click',
  
  // Signup Lifecycle Events
  SIGNUP_START: 'signup_start',
  SIGNUP_SUBMIT: 'signup_submit',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_ERROR: 'signup_error',
  
  // Pricing Events
  PRICING_TOGGLE: 'pricing_toggle',
  PRICING_PLAN_SELECT: 'pricing_plan_select',
  
  // FAQ Events
  FAQ_EXPAND: 'faq_expand',
  FAQ_COLLAPSE: 'faq_collapse',
  
  // Activation/First-Run Events
  ACTIVATION_STEP_VIEW: 'activation_step_view',
  ACTIVATION_STEP_COMPLETE: 'activation_step_complete',
  ACTIVATION_COMPLETE: 'activation_complete',
  FIRST_ROADMAP_START: 'first_roadmap_start',
  FIRST_ROADMAP_COMPLETE: 'first_roadmap_complete',
  
  // Error Events
  ERROR_RUNTIME: 'error_runtime',
  ERROR_BOUNDARY_CAUGHT: 'error_boundary_caught',
  
  // Feature Usage Events
  FEATURE_VIEW: 'feature_view',
  TESTIMONIAL_VIEW: 'testimonial_view',
} as const;

export type AnalyticsEventName = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];

// ============================================================================
// Event Property Types
// ============================================================================

export interface PageViewProperties {
  page_path: string;
  page_title: string;
  page_referrer?: string;
  page_location?: string;
}

export interface CTAClickProperties {
  cta_id: string;
  cta_text: string;
  cta_location: string;
  cta_destination?: string;
  cta_variant?: 'primary' | 'secondary' | 'link';
}

export interface SignupStartProperties {
  source: string;
  referrer?: string;
}

export interface SignupSubmitProperties {
  has_company: boolean;
  has_role: boolean;
  role?: string;
}

export interface SignupSuccessProperties {
  user_email_domain: string;
  has_company: boolean;
  role?: string;
  time_to_complete_ms: number;
}

export interface SignupErrorProperties {
  error_type: 'validation' | 'server' | 'network' | 'unknown';
  error_field?: string;
  error_message?: string;
}

export interface PricingToggleProperties {
  billing_period: 'monthly' | 'yearly';
  previous_period: 'monthly' | 'yearly';
}

export interface PricingPlanSelectProperties {
  plan_name: string;
  plan_price: number;
  billing_period: 'monthly' | 'yearly';
  is_highlighted: boolean;
}

export interface FAQExpandProperties {
  faq_question: string;
  faq_index: number;
}

export interface FAQCollapseProperties {
  faq_question: string;
  faq_index: number;
  time_open_ms: number;
}

export interface ActivationStepViewProperties {
  step_number: number;
  step_name: string;
  time_since_signup_ms?: number;
}

export interface ActivationStepCompleteProperties {
  step_number: number;
  step_name: string;
  time_to_complete_ms: number;
  time_since_signup_ms?: number;
}

export interface ActivationCompleteProperties {
  total_steps: number;
  total_time_ms: number;
  steps_completed: string[];
}

export interface FirstRoadmapStartProperties {
  template_used?: string;
  time_since_signup_ms: number;
}

export interface FirstRoadmapCompleteProperties {
  template_used?: string;
  time_to_complete_ms: number;
  time_since_signup_ms: number;
  roadmap_items_count: number;
}

export interface RuntimeErrorProperties {
  error_message: string;
  error_stack?: string;
  error_name?: string;
  component_stack?: string;
  page_path: string;
}

export interface ErrorBoundaryCaughtProperties {
  error_message: string;
  error_stack?: string;
  component_name?: string;
  page_path: string;
}

export interface FeatureViewProperties {
  feature_name: string;
  feature_index: number;
  viewport_position: 'above_fold' | 'below_fold';
}

export interface TestimonialViewProperties {
  author_name: string;
  company: string;
  testimonial_index: number;
}

// ============================================================================
// Event Map - Maps event names to their property types
// ============================================================================

export interface AnalyticsEventMap {
  [AnalyticsEvents.PAGE_VIEW]: PageViewProperties;
  [AnalyticsEvents.CTA_CLICK]: CTAClickProperties;
  [AnalyticsEvents.SIGNUP_START]: SignupStartProperties;
  [AnalyticsEvents.SIGNUP_SUBMIT]: SignupSubmitProperties;
  [AnalyticsEvents.SIGNUP_SUCCESS]: SignupSuccessProperties;
  [AnalyticsEvents.SIGNUP_ERROR]: SignupErrorProperties;
  [AnalyticsEvents.PRICING_TOGGLE]: PricingToggleProperties;
  [AnalyticsEvents.PRICING_PLAN_SELECT]: PricingPlanSelectProperties;
  [AnalyticsEvents.FAQ_EXPAND]: FAQExpandProperties;
  [AnalyticsEvents.FAQ_COLLAPSE]: FAQCollapseProperties;
  [AnalyticsEvents.ACTIVATION_STEP_VIEW]: ActivationStepViewProperties;
  [AnalyticsEvents.ACTIVATION_STEP_COMPLETE]: ActivationStepCompleteProperties;
  [AnalyticsEvents.ACTIVATION_COMPLETE]: ActivationCompleteProperties;
  [AnalyticsEvents.FIRST_ROADMAP_START]: FirstRoadmapStartProperties;
  [AnalyticsEvents.FIRST_ROADMAP_COMPLETE]: FirstRoadmapCompleteProperties;
  [AnalyticsEvents.ERROR_RUNTIME]: RuntimeErrorProperties;
  [AnalyticsEvents.ERROR_BOUNDARY_CAUGHT]: ErrorBoundaryCaughtProperties;
  [AnalyticsEvents.FEATURE_VIEW]: FeatureViewProperties;
  [AnalyticsEvents.TESTIMONIAL_VIEW]: TestimonialViewProperties;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Helper type to get the properties type for a given event name
 */
export type EventProperties<T extends AnalyticsEventName> = T extends keyof AnalyticsEventMap
  ? AnalyticsEventMap[T]
  : Record<string, unknown>;

/**
 * Base properties included with every event
 */
export interface BaseEventProperties {
  timestamp: number;
  session_id: string;
  user_id?: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  viewport_width: number;
  viewport_height: number;
}

/**
 * Full event payload structure
 */
export interface AnalyticsEventPayload<T extends AnalyticsEventName = AnalyticsEventName> {
  event_name: T;
  properties: EventProperties<T> & Partial<BaseEventProperties>;
}
