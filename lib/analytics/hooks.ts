"use client";

/**
 * Analytics Hooks for React Components
 * 
 * Custom hooks for tracking events in React components.
 */

import { useCallback, useEffect, useRef } from 'react';
import { trackEvent, trackPageView } from './core';
import {
  AnalyticsEvents,
  CTAClickProperties,
  SignupStartProperties,
  SignupSubmitProperties,
  SignupSuccessProperties,
  SignupErrorProperties,
  PricingToggleProperties,
  PricingPlanSelectProperties,
  FAQExpandProperties,
  FAQCollapseProperties,
  ActivationStepViewProperties,
  ActivationStepCompleteProperties,
  ActivationCompleteProperties,
  FirstRoadmapStartProperties,
  FirstRoadmapCompleteProperties,
  RuntimeErrorProperties,
  FeatureViewProperties,
} from './schema';

// ============================================================================
// Page View Hook
// ============================================================================

/**
 * Hook to track page views on mount and route changes
 */
export function usePageView(path: string, title?: string): void {
  const hasTracked = useRef(false);
  
  useEffect(() => {
    // Only track once per mount
    if (!hasTracked.current) {
      trackPageView(path, title);
      hasTracked.current = true;
    }
  }, [path, title]);
}

// ============================================================================
// CTA Click Hook
// ============================================================================

export interface UseCTAClickOptions {
  ctaId: string;
  ctaText: string;
  ctaLocation: string;
  ctaDestination?: string;
  ctaVariant?: 'primary' | 'secondary' | 'link';
}

/**
 * Hook to track CTA button clicks
 */
export function useCTAClick(options: UseCTAClickOptions) {
  const trackClick = useCallback(() => {
    const properties: CTAClickProperties = {
      cta_id: options.ctaId,
      cta_text: options.ctaText,
      cta_location: options.ctaLocation,
      cta_destination: options.ctaDestination,
      cta_variant: options.ctaVariant,
    };
    
    trackEvent(AnalyticsEvents.CTA_CLICK, properties);
  }, [options.ctaId, options.ctaText, options.ctaLocation, options.ctaDestination, options.ctaVariant]);
  
  return { trackClick };
}

// ============================================================================
// Signup Lifecycle Hook
// ============================================================================

interface SignupTrackingState {
  startTime: number | null;
}

/**
 * Hook to track the entire signup lifecycle
 */
export function useSignupTracking() {
  const state = useRef<SignupTrackingState>({ startTime: null });
  
  const trackStart = useCallback((source: string, referrer?: string) => {
    state.current.startTime = Date.now();
    
    const properties: SignupStartProperties = {
      source,
      referrer,
    };
    
    trackEvent(AnalyticsEvents.SIGNUP_START, properties);
  }, []);
  
  const trackSubmit = useCallback((hasCompany: boolean, hasRole: boolean, role?: string) => {
    const properties: SignupSubmitProperties = {
      has_company: hasCompany,
      has_role: hasRole,
      role,
    };
    
    trackEvent(AnalyticsEvents.SIGNUP_SUBMIT, properties);
  }, []);
  
  const trackSuccess = useCallback((email: string, hasCompany: boolean, role?: string) => {
    const timeToComplete = state.current.startTime 
      ? Date.now() - state.current.startTime 
      : 0;
    
    // Extract domain from email for anonymized tracking
    const emailDomain = email.split('@')[1] || 'unknown';
    
    const properties: SignupSuccessProperties = {
      user_email_domain: emailDomain,
      has_company: hasCompany,
      role,
      time_to_complete_ms: timeToComplete,
    };
    
    trackEvent(AnalyticsEvents.SIGNUP_SUCCESS, properties);
    state.current.startTime = null;
  }, []);
  
  const trackError = useCallback((
    errorType: 'validation' | 'server' | 'network' | 'unknown',
    errorField?: string,
    errorMessage?: string
  ) => {
    const properties: SignupErrorProperties = {
      error_type: errorType,
      error_field: errorField,
      error_message: errorMessage,
    };
    
    trackEvent(AnalyticsEvents.SIGNUP_ERROR, properties);
  }, []);
  
  return { trackStart, trackSubmit, trackSuccess, trackError };
}

// ============================================================================
// Pricing Hook
// ============================================================================

/**
 * Hook to track pricing interactions
 */
export function usePricingTracking() {
  const trackToggle = useCallback((
    newPeriod: 'monthly' | 'yearly',
    previousPeriod: 'monthly' | 'yearly'
  ) => {
    const properties: PricingToggleProperties = {
      billing_period: newPeriod,
      previous_period: previousPeriod,
    };
    
    trackEvent(AnalyticsEvents.PRICING_TOGGLE, properties);
  }, []);
  
  const trackPlanSelect = useCallback((
    planName: string,
    planPrice: number,
    billingPeriod: 'monthly' | 'yearly',
    isHighlighted: boolean
  ) => {
    const properties: PricingPlanSelectProperties = {
      plan_name: planName,
      plan_price: planPrice,
      billing_period: billingPeriod,
      is_highlighted: isHighlighted,
    };
    
    trackEvent(AnalyticsEvents.PRICING_PLAN_SELECT, properties);
  }, []);
  
  return { trackToggle, trackPlanSelect };
}

// ============================================================================
// FAQ Hook
// ============================================================================

interface FAQTrackingState {
  [index: number]: number | undefined;
}

/**
 * Hook to track FAQ expand/collapse interactions
 */
export function useFAQTracking() {
  const openTimes = useRef<FAQTrackingState>({});
  
  const trackExpand = useCallback((question: string, index: number) => {
    openTimes.current[index] = Date.now();
    
    const properties: FAQExpandProperties = {
      faq_question: question,
      faq_index: index,
    };
    
    trackEvent(AnalyticsEvents.FAQ_EXPAND, properties);
  }, []);
  
  const trackCollapse = useCallback((question: string, index: number) => {
    const openTime = openTimes.current[index];
    const timeOpen = openTime ? Date.now() - openTime : 0;
    
    const properties: FAQCollapseProperties = {
      faq_question: question,
      faq_index: index,
      time_open_ms: timeOpen,
    };
    
    trackEvent(AnalyticsEvents.FAQ_COLLAPSE, properties);
    delete openTimes.current[index];
  }, []);
  
  return { trackExpand, trackCollapse };
}

// ============================================================================
// Activation/First-Run Hook
// ============================================================================

interface ActivationState {
  signupTime: number | null;
  stepStartTimes: { [step: number]: number };
  completedSteps: string[];
}

/**
 * Hook to track first-run/activation events for measuring time-to-value
 */
export function useActivationTracking() {
  const state = useRef<ActivationState>({
    signupTime: null,
    stepStartTimes: {},
    completedSteps: [],
  });
  
  // Initialize signup time from storage or set it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTime = sessionStorage.getItem('rg_signup_time');
      if (storedTime) {
        state.current.signupTime = parseInt(storedTime, 10);
      }
    }
  }, []);
  
  const setSignupTime = useCallback(() => {
    const now = Date.now();
    state.current.signupTime = now;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('rg_signup_time', now.toString());
    }
  }, []);
  
  const trackStepView = useCallback((stepNumber: number, stepName: string) => {
    state.current.stepStartTimes[stepNumber] = Date.now();
    
    const timeSinceSignup = state.current.signupTime 
      ? Date.now() - state.current.signupTime 
      : undefined;
    
    const properties: ActivationStepViewProperties = {
      step_number: stepNumber,
      step_name: stepName,
      time_since_signup_ms: timeSinceSignup,
    };
    
    trackEvent(AnalyticsEvents.ACTIVATION_STEP_VIEW, properties);
  }, []);
  
  const trackStepComplete = useCallback((stepNumber: number, stepName: string) => {
    const startTime = state.current.stepStartTimes[stepNumber];
    const timeToComplete = startTime ? Date.now() - startTime : 0;
    const timeSinceSignup = state.current.signupTime 
      ? Date.now() - state.current.signupTime 
      : undefined;
    
    state.current.completedSteps.push(stepName);
    
    const properties: ActivationStepCompleteProperties = {
      step_number: stepNumber,
      step_name: stepName,
      time_to_complete_ms: timeToComplete,
      time_since_signup_ms: timeSinceSignup,
    };
    
    trackEvent(AnalyticsEvents.ACTIVATION_STEP_COMPLETE, properties);
  }, []);
  
  const trackActivationComplete = useCallback((totalSteps: number) => {
    const totalTime = state.current.signupTime 
      ? Date.now() - state.current.signupTime 
      : 0;
    
    const properties: ActivationCompleteProperties = {
      total_steps: totalSteps,
      total_time_ms: totalTime,
      steps_completed: state.current.completedSteps,
    };
    
    trackEvent(AnalyticsEvents.ACTIVATION_COMPLETE, properties);
  }, []);
  
  const trackFirstRoadmapStart = useCallback((templateUsed?: string) => {
    const timeSinceSignup = state.current.signupTime 
      ? Date.now() - state.current.signupTime 
      : 0;
    
    const properties: FirstRoadmapStartProperties = {
      template_used: templateUsed,
      time_since_signup_ms: timeSinceSignup,
    };
    
    trackEvent(AnalyticsEvents.FIRST_ROADMAP_START, properties);
  }, []);
  
  const trackFirstRoadmapComplete = useCallback((
    templateUsed: string | undefined,
    roadmapItemsCount: number,
    startTime: number
  ) => {
    const timeSinceSignup = state.current.signupTime 
      ? Date.now() - state.current.signupTime 
      : 0;
    
    const properties: FirstRoadmapCompleteProperties = {
      template_used: templateUsed,
      time_to_complete_ms: Date.now() - startTime,
      time_since_signup_ms: timeSinceSignup,
      roadmap_items_count: roadmapItemsCount,
    };
    
    trackEvent(AnalyticsEvents.FIRST_ROADMAP_COMPLETE, properties);
  }, []);
  
  return {
    setSignupTime,
    trackStepView,
    trackStepComplete,
    trackActivationComplete,
    trackFirstRoadmapStart,
    trackFirstRoadmapComplete,
  };
}

// ============================================================================
// Error Tracking Hook
// ============================================================================

/**
 * Hook to track runtime errors
 */
export function useErrorTracking() {
  const trackError = useCallback((
    error: Error,
    componentStack?: string
  ) => {
    const properties: RuntimeErrorProperties = {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      component_stack: componentStack,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    };
    
    trackEvent(AnalyticsEvents.ERROR_RUNTIME, properties);
  }, []);
  
  return { trackError };
}

// ============================================================================
// Feature View Hook
// ============================================================================

/**
 * Hook to track feature card views (for scroll tracking)
 */
export function useFeatureViewTracking() {
  const trackedFeatures = useRef<Set<number>>(new Set());
  
  const trackFeatureView = useCallback((
    featureName: string,
    featureIndex: number,
    isAboveFold: boolean
  ) => {
    // Only track each feature once per session
    if (trackedFeatures.current.has(featureIndex)) {
      return;
    }
    
    trackedFeatures.current.add(featureIndex);
    
    const properties: FeatureViewProperties = {
      feature_name: featureName,
      feature_index: featureIndex,
      viewport_position: isAboveFold ? 'above_fold' : 'below_fold',
    };
    
    trackEvent(AnalyticsEvents.FEATURE_VIEW, properties);
  }, []);
  
  return { trackFeatureView };
}
