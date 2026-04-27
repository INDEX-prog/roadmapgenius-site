/**
 * Analytics Core Module
 * 
 * Lightweight analytics event layer for Next.js App Router.
 * This module handles event collection, buffering, and dispatch.
 */

import {
  AnalyticsEventName,
  AnalyticsEventPayload,
  EventProperties,
  BaseEventProperties,
} from './schema';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  bufferSize: number;
  flushInterval: number;
  endpoint?: string;
}

interface EventBuffer {
  events: AnalyticsEventPayload[];
  lastFlush: number;
}

// ============================================================================
// Session Management
// ============================================================================

let sessionId: string | null = null;

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server-side';
  }
  
  if (!sessionId) {
    // Try to restore from sessionStorage
    try {
      sessionId = sessionStorage.getItem('rg_session_id');
      if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('rg_session_id', sessionId);
      }
    } catch {
      sessionId = generateSessionId();
    }
  }
  
  return sessionId;
}

// ============================================================================
// Device Detection
// ============================================================================

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop';
  }
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ============================================================================
// Analytics Engine
// ============================================================================

const defaultConfig: AnalyticsConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  bufferSize: 10,
  flushInterval: 5000, // 5 seconds
  endpoint: undefined,
};

let config: AnalyticsConfig = { ...defaultConfig };
let buffer: EventBuffer = { events: [], lastFlush: Date.now() };
let flushTimer: NodeJS.Timeout | null = null;

/**
 * Configure the analytics engine
 */
export function configureAnalytics(newConfig: Partial<AnalyticsConfig>): void {
  config = { ...config, ...newConfig };
  
  if (config.debug) {
    console.log('[Analytics] Configuration updated:', config);
  }
}

/**
 * Get base properties for all events
 */
function getBaseProperties(): Partial<BaseEventProperties> {
  const baseProps: Partial<BaseEventProperties> = {
    timestamp: Date.now(),
    session_id: getSessionId(),
  };
  
  if (typeof window !== 'undefined') {
    baseProps.device_type = getDeviceType();
    baseProps.viewport_width = window.innerWidth;
    baseProps.viewport_height = window.innerHeight;
  }
  
  return baseProps;
}

/**
 * Flush the event buffer (send events to analytics endpoint)
 */
function flushBuffer(): void {
  if (buffer.events.length === 0) {
    return;
  }
  
  const eventsToSend = [...buffer.events];
  buffer.events = [];
  buffer.lastFlush = Date.now();
  
  if (config.debug) {
    console.log('[Analytics] Flushing buffer:', eventsToSend);
  }
  
  // In production, this would send to an analytics endpoint
  // For now, we store in localStorage for debugging/demo purposes
  if (typeof window !== 'undefined') {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('rg_analytics_events') || '[]');
      const allEvents = [...existingEvents, ...eventsToSend].slice(-100); // Keep last 100 events
      localStorage.setItem('rg_analytics_events', JSON.stringify(allEvents));
    } catch {
      // Silently fail if localStorage is not available
    }
    
    // If endpoint is configured, send events via beacon or fetch
    if (config.endpoint) {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(config.endpoint, JSON.stringify(eventsToSend));
        } else {
          fetch(config.endpoint, {
            method: 'POST',
            body: JSON.stringify(eventsToSend),
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
          }).catch(() => {
            // Silently fail
          });
        }
      } catch {
        // Silently fail
      }
    }
  }
}

/**
 * Start the automatic flush timer
 */
function startFlushTimer(): void {
  if (flushTimer || typeof window === 'undefined') {
    return;
  }
  
  flushTimer = setInterval(() => {
    if (Date.now() - buffer.lastFlush >= config.flushInterval) {
      flushBuffer();
    }
  }, config.flushInterval);
  
  // Flush on page unload
  window.addEventListener('beforeunload', flushBuffer);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushBuffer();
    }
  });
}

/**
 * Track an analytics event
 */
export function trackEvent<T extends AnalyticsEventName>(
  eventName: T,
  properties: EventProperties<T>
): void {
  if (!config.enabled) {
    return;
  }
  
  const payload: AnalyticsEventPayload<T> = {
    event_name: eventName,
    properties: {
      ...properties,
      ...getBaseProperties(),
    } as EventProperties<T> & Partial<BaseEventProperties>,
  };
  
  if (config.debug) {
    console.log('[Analytics] Event tracked:', payload);
  }
  
  buffer.events.push(payload);
  
  // Flush if buffer is full
  if (buffer.events.length >= config.bufferSize) {
    flushBuffer();
  }
  
  // Ensure flush timer is running
  startFlushTimer();
}

/**
 * Track page view event
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent('page_view', {
    page_path: path,
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
    page_referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
  });
}

/**
 * Get all stored analytics events (for debugging)
 */
export function getStoredEvents(): AnalyticsEventPayload[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    return JSON.parse(localStorage.getItem('rg_analytics_events') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear all stored analytics events
 */
export function clearStoredEvents(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rg_analytics_events');
  }
}

/**
 * Identify a user (attach user ID to session)
 */
export function identifyUser(userId: string): void {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('rg_user_id', userId);
    } catch {
      // Silently fail
    }
  }
  
  if (config.debug) {
    console.log('[Analytics] User identified:', userId);
  }
}
