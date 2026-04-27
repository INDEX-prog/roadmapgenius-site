/**
 * Product Health Reporting Utilities
 * 
 * Utilities for generating weekly product health metrics including:
 * - Acquisition metrics
 * - Activation metrics
 * - Retention metrics
 * - Product stability metrics
 * - Revenue metrics
 */

import { AnalyticsEvents, AnalyticsEventPayload } from './schema';
import { getStoredEvents } from './core';

// ============================================================================
// Types
// ============================================================================

export interface AcquisitionMetrics {
  total_visitors: number;
  unique_sessions: number;
  signup_starts: number;
  signup_completions: number;
  signup_conversion_rate: number;
  top_cta_clicks: Array<{ cta_id: string; count: number }>;
  traffic_by_device: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface ActivationMetrics {
  total_activations: number;
  average_time_to_first_roadmap_ms: number;
  median_time_to_first_roadmap_ms: number;
  step_completion_rates: Array<{
    step_name: string;
    completion_rate: number;
    average_time_ms: number;
  }>;
  activation_funnel: Array<{
    step: string;
    users: number;
    drop_off_rate: number;
  }>;
}

export interface RetentionMetrics {
  daily_active_users: number;
  weekly_active_users: number;
  return_visitor_rate: number;
  average_session_duration_ms: number;
  pages_per_session: number;
  feature_engagement: Array<{
    feature_name: string;
    view_count: number;
    engagement_rate: number;
  }>;
}

export interface StabilityMetrics {
  total_errors: number;
  unique_errors: number;
  error_rate: number;
  errors_by_type: Array<{
    error_name: string;
    count: number;
    affected_users: number;
  }>;
  affected_pages: Array<{
    page_path: string;
    error_count: number;
  }>;
  error_free_session_rate: number;
}

export interface RevenueMetrics {
  pricing_page_views: number;
  pricing_toggle_rate: number;
  plan_selection_distribution: Array<{
    plan_name: string;
    selections: number;
    percentage: number;
  }>;
  yearly_vs_monthly_preference: {
    yearly: number;
    monthly: number;
    yearly_percentage: number;
  };
}

export interface ProductHealthReport {
  report_period: {
    start: number;
    end: number;
  };
  generated_at: number;
  acquisition: AcquisitionMetrics;
  activation: ActivationMetrics;
  retention: RetentionMetrics;
  stability: StabilityMetrics;
  revenue: RevenueMetrics;
  summary: {
    health_score: number; // 0-100
    key_insights: string[];
    recommended_actions: string[];
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function getUniqueCount<T>(items: T[], keyFn: (item: T) => string): number {
  const uniqueKeys = new Set(items.map(keyFn));
  return uniqueKeys.size;
}

function filterEventsByTimeRange(
  events: AnalyticsEventPayload[],
  startTime: number,
  endTime: number
): AnalyticsEventPayload[] {
  return events.filter(event => {
    const timestamp = (event.properties as { timestamp?: number }).timestamp || 0;
    return timestamp >= startTime && timestamp <= endTime;
  });
}

function filterEventsByName(
  events: AnalyticsEventPayload[],
  eventName: string
): AnalyticsEventPayload[] {
  return events.filter(event => event.event_name === eventName);
}

// ============================================================================
// Metric Calculators
// ============================================================================

function calculateAcquisitionMetrics(events: AnalyticsEventPayload[]): AcquisitionMetrics {
  const pageViews = filterEventsByName(events, AnalyticsEvents.PAGE_VIEW);
  const signupStarts = filterEventsByName(events, AnalyticsEvents.SIGNUP_START);
  const signupSuccesses = filterEventsByName(events, AnalyticsEvents.SIGNUP_SUCCESS);
  const ctaClicks = filterEventsByName(events, AnalyticsEvents.CTA_CLICK);
  
  // Count unique sessions
  const uniqueSessions = getUniqueCount(
    events,
    e => (e.properties as { session_id?: string }).session_id || ''
  );
  
  // Count CTA clicks by ID
  const ctaClickCounts: Record<string, number> = {};
  ctaClicks.forEach(event => {
    const ctaId = (event.properties as { cta_id?: string }).cta_id || 'unknown';
    ctaClickCounts[ctaId] = (ctaClickCounts[ctaId] || 0) + 1;
  });
  
  const topCtaClicks = Object.entries(ctaClickCounts)
    .map(([cta_id, count]) => ({ cta_id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Traffic by device
  const deviceCounts = { mobile: 0, tablet: 0, desktop: 0 };
  pageViews.forEach(event => {
    const deviceType = (event.properties as { device_type?: string }).device_type as keyof typeof deviceCounts;
    if (deviceType && deviceCounts[deviceType] !== undefined) {
      deviceCounts[deviceType]++;
    }
  });
  
  return {
    total_visitors: pageViews.length,
    unique_sessions: uniqueSessions,
    signup_starts: signupStarts.length,
    signup_completions: signupSuccesses.length,
    signup_conversion_rate: signupStarts.length > 0 
      ? (signupSuccesses.length / signupStarts.length) * 100 
      : 0,
    top_cta_clicks: topCtaClicks,
    traffic_by_device: deviceCounts,
  };
}

function calculateActivationMetrics(events: AnalyticsEventPayload[]): ActivationMetrics {
  const activationCompletes = filterEventsByName(events, AnalyticsEvents.ACTIVATION_COMPLETE);
  const stepCompletes = filterEventsByName(events, AnalyticsEvents.ACTIVATION_STEP_COMPLETE);
  const roadmapCompletes = filterEventsByName(events, AnalyticsEvents.FIRST_ROADMAP_COMPLETE);
  
  // Time to first roadmap
  const timesToRoadmap = roadmapCompletes.map(event => 
    (event.properties as { time_since_signup_ms?: number }).time_since_signup_ms || 0
  );
  
  // Step completion rates
  const stepStats: Record<string, { count: number; totalTime: number }> = {};
  stepCompletes.forEach(event => {
    const props = event.properties as { step_name?: string; time_to_complete_ms?: number };
    const stepName = props.step_name || 'unknown';
    const time = props.time_to_complete_ms || 0;
    
    if (!stepStats[stepName]) {
      stepStats[stepName] = { count: 0, totalTime: 0 };
    }
    stepStats[stepName].count++;
    stepStats[stepName].totalTime += time;
  });
  
  const stepCompletionRates = Object.entries(stepStats)
    .map(([step_name, stats]) => ({
      step_name,
      completion_rate: 100, // Would need total step views to calculate properly
      average_time_ms: stats.count > 0 ? stats.totalTime / stats.count : 0,
    }));
  
  return {
    total_activations: activationCompletes.length,
    average_time_to_first_roadmap_ms: timesToRoadmap.length > 0
      ? timesToRoadmap.reduce((a, b) => a + b, 0) / timesToRoadmap.length
      : 0,
    median_time_to_first_roadmap_ms: calculateMedian(timesToRoadmap),
    step_completion_rates: stepCompletionRates,
    activation_funnel: [], // Would need more data to populate
  };
}

function calculateRetentionMetrics(events: AnalyticsEventPayload[]): RetentionMetrics {
  const pageViews = filterEventsByName(events, AnalyticsEvents.PAGE_VIEW);
  const featureViews = filterEventsByName(events, AnalyticsEvents.FEATURE_VIEW);
  
  // Calculate unique sessions per day
  const sessionsByDay: Record<string, Set<string>> = {};
  pageViews.forEach(event => {
    const timestamp = (event.properties as { timestamp?: number }).timestamp || 0;
    const sessionId = (event.properties as { session_id?: string }).session_id || '';
    const day = new Date(timestamp).toISOString().split('T')[0];
    
    if (!sessionsByDay[day]) {
      sessionsByDay[day] = new Set();
    }
    sessionsByDay[day].add(sessionId);
  });
  
  const days = Object.keys(sessionsByDay).sort();
  const lastDay = days[days.length - 1] || '';
  const lastWeekDays = days.slice(-7);
  
  const dailyActiveUsers = sessionsByDay[lastDay]?.size || 0;
  const weeklyActiveUsers = new Set(
    lastWeekDays.flatMap(day => Array.from(sessionsByDay[day] || []))
  ).size;
  
  // Feature engagement
  const featureCounts: Record<string, number> = {};
  featureViews.forEach(event => {
    const featureName = (event.properties as { feature_name?: string }).feature_name || 'unknown';
    featureCounts[featureName] = (featureCounts[featureName] || 0) + 1;
  });
  
  const featureEngagement = Object.entries(featureCounts)
    .map(([feature_name, view_count]) => ({
      feature_name,
      view_count,
      engagement_rate: pageViews.length > 0 ? (view_count / pageViews.length) * 100 : 0,
    }))
    .sort((a, b) => b.view_count - a.view_count);
  
  return {
    daily_active_users: dailyActiveUsers,
    weekly_active_users: weeklyActiveUsers,
    return_visitor_rate: 0, // Would need user identification to calculate
    average_session_duration_ms: 0, // Would need session end events
    pages_per_session: pageViews.length / Math.max(1, getUniqueCount(
      pageViews,
      e => (e.properties as { session_id?: string }).session_id || ''
    )),
    feature_engagement: featureEngagement,
  };
}

function calculateStabilityMetrics(events: AnalyticsEventPayload[]): StabilityMetrics {
  const runtimeErrors = filterEventsByName(events, AnalyticsEvents.ERROR_RUNTIME);
  const boundaryErrors = filterEventsByName(events, AnalyticsEvents.ERROR_BOUNDARY_CAUGHT);
  const allErrors = [...runtimeErrors, ...boundaryErrors];
  const allSessions = getUniqueCount(
    events,
    e => (e.properties as { session_id?: string }).session_id || ''
  );
  
  // Unique errors by message
  const uniqueErrorMessages = new Set(
    allErrors.map(e => (e.properties as { error_message?: string }).error_message || '')
  );
  
  // Errors by type
  const errorsByName: Record<string, { count: number; sessions: Set<string> }> = {};
  allErrors.forEach(event => {
    const props = event.properties as { error_name?: string; session_id?: string };
    const errorName = props.error_name || 'Unknown';
    const sessionId = props.session_id || '';
    
    if (!errorsByName[errorName]) {
      errorsByName[errorName] = { count: 0, sessions: new Set() };
    }
    errorsByName[errorName].count++;
    errorsByName[errorName].sessions.add(sessionId);
  });
  
  const errorsByType = Object.entries(errorsByName)
    .map(([error_name, data]) => ({
      error_name,
      count: data.count,
      affected_users: data.sessions.size,
    }))
    .sort((a, b) => b.count - a.count);
  
  // Affected pages
  const errorsByPage: Record<string, number> = {};
  allErrors.forEach(event => {
    const pagePath = (event.properties as { page_path?: string }).page_path || '/';
    errorsByPage[pagePath] = (errorsByPage[pagePath] || 0) + 1;
  });
  
  const affectedPages = Object.entries(errorsByPage)
    .map(([page_path, error_count]) => ({ page_path, error_count }))
    .sort((a, b) => b.error_count - a.error_count);
  
  // Sessions with errors
  const sessionsWithErrors = getUniqueCount(
    allErrors,
    e => (e.properties as { session_id?: string }).session_id || ''
  );
  
  return {
    total_errors: allErrors.length,
    unique_errors: uniqueErrorMessages.size,
    error_rate: allSessions > 0 ? (sessionsWithErrors / allSessions) * 100 : 0,
    errors_by_type: errorsByType,
    affected_pages: affectedPages,
    error_free_session_rate: allSessions > 0 
      ? ((allSessions - sessionsWithErrors) / allSessions) * 100 
      : 100,
  };
}

function calculateRevenueMetrics(events: AnalyticsEventPayload[]): RevenueMetrics {
  const pageViews = filterEventsByName(events, AnalyticsEvents.PAGE_VIEW);
  const pricingToggles = filterEventsByName(events, AnalyticsEvents.PRICING_TOGGLE);
  const planSelections = filterEventsByName(events, AnalyticsEvents.PRICING_PLAN_SELECT);
  
  // Pricing page views
  const pricingPageViews = pageViews.filter(event => {
    const pagePath = (event.properties as { page_path?: string }).page_path || '';
    return pagePath.includes('pricing') || pagePath.includes('#pricing');
  }).length;
  
  // Plan selection distribution
  const planCounts: Record<string, number> = {};
  planSelections.forEach(event => {
    const planName = (event.properties as { plan_name?: string }).plan_name || 'unknown';
    planCounts[planName] = (planCounts[planName] || 0) + 1;
  });
  
  const totalSelections = planSelections.length;
  const planDistribution = Object.entries(planCounts)
    .map(([plan_name, selections]) => ({
      plan_name,
      selections,
      percentage: totalSelections > 0 ? (selections / totalSelections) * 100 : 0,
    }))
    .sort((a, b) => b.selections - a.selections);
  
  // Yearly vs monthly preference
  let yearlyCount = 0;
  let monthlyCount = 0;
  planSelections.forEach(event => {
    const billingPeriod = (event.properties as { billing_period?: string }).billing_period;
    if (billingPeriod === 'yearly') yearlyCount++;
    else if (billingPeriod === 'monthly') monthlyCount++;
  });
  
  return {
    pricing_page_views: pricingPageViews,
    pricing_toggle_rate: pricingPageViews > 0 
      ? (pricingToggles.length / pricingPageViews) * 100 
      : 0,
    plan_selection_distribution: planDistribution,
    yearly_vs_monthly_preference: {
      yearly: yearlyCount,
      monthly: monthlyCount,
      yearly_percentage: (yearlyCount + monthlyCount) > 0 
        ? (yearlyCount / (yearlyCount + monthlyCount)) * 100 
        : 0,
    },
  };
}

function generateSummary(
  acquisition: AcquisitionMetrics,
  activation: ActivationMetrics,
  retention: RetentionMetrics,
  stability: StabilityMetrics,
  revenue: RevenueMetrics
): { health_score: number; key_insights: string[]; recommended_actions: string[] } {
  const insights: string[] = [];
  const actions: string[] = [];
  
  // Calculate component scores (0-100)
  const acquisitionScore = Math.min(100, acquisition.signup_conversion_rate * 10);
  const activationScore = activation.total_activations > 0 ? 75 : 25;
  const retentionScore = Math.min(100, retention.pages_per_session * 20);
  const stabilityScore = Math.max(0, 100 - stability.error_rate * 10);
  const revenueScore = revenue.yearly_vs_monthly_preference.yearly_percentage;
  
  const healthScore = Math.round(
    (acquisitionScore + activationScore + retentionScore + stabilityScore + revenueScore) / 5
  );
  
  // Generate insights
  if (acquisition.signup_conversion_rate < 5) {
    insights.push('Signup conversion rate is below industry average');
    actions.push('Consider A/B testing signup form placement and copy');
  }
  
  if (stability.error_rate > 1) {
    insights.push(`Error rate of ${stability.error_rate.toFixed(1)}% is impacting user experience`);
    actions.push('Investigate and fix top error sources');
  }
  
  if (acquisition.traffic_by_device.mobile > acquisition.traffic_by_device.desktop) {
    insights.push('Mobile traffic exceeds desktop - ensure mobile optimization');
  }
  
  if (revenue.yearly_vs_monthly_preference.yearly_percentage > 60) {
    insights.push('Strong preference for yearly billing indicates pricing confidence');
  }
  
  if (insights.length === 0) {
    insights.push('Product metrics are within healthy ranges');
  }
  
  if (actions.length === 0) {
    actions.push('Continue monitoring key metrics');
  }
  
  return { health_score: healthScore, key_insights: insights, recommended_actions: actions };
}

// ============================================================================
// Main Export Function
// ============================================================================

/**
 * Generate a complete product health report for the specified time period
 * 
 * @param startTime - Report period start (timestamp)
 * @param endTime - Report period end (timestamp)
 * @returns Complete ProductHealthReport
 */
export function generateProductHealthReport(
  startTime?: number,
  endTime?: number
): ProductHealthReport {
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  
  const periodStart = startTime || (now - weekMs);
  const periodEnd = endTime || now;
  
  // Get all stored events
  const allEvents = getStoredEvents();
  
  // Filter to time range
  const events = filterEventsByTimeRange(allEvents, periodStart, periodEnd);
  
  // Calculate all metrics
  const acquisition = calculateAcquisitionMetrics(events);
  const activation = calculateActivationMetrics(events);
  const retention = calculateRetentionMetrics(events);
  const stability = calculateStabilityMetrics(events);
  const revenue = calculateRevenueMetrics(events);
  
  // Generate summary
  const summary = generateSummary(acquisition, activation, retention, stability, revenue);
  
  return {
    report_period: {
      start: periodStart,
      end: periodEnd,
    },
    generated_at: now,
    acquisition,
    activation,
    retention,
    stability,
    revenue,
    summary,
  };
}

/**
 * Get a quick snapshot of key metrics
 */
export function getMetricsSnapshot(): {
  signupRate: number;
  errorRate: number;
  activeSessions: number;
  healthScore: number;
} {
  const report = generateProductHealthReport();
  
  return {
    signupRate: report.acquisition.signup_conversion_rate,
    errorRate: report.stability.error_rate,
    activeSessions: report.acquisition.unique_sessions,
    healthScore: report.summary.health_score,
  };
}
