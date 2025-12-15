/**
 * Share feature constants
 */

/**
 * Template dimensions
 */
export const TEMPLATE_WIDTH = 380;
export const CARD_WIDTH = 350;

/**
 * Template types
 */
export const TEMPLATE_STYLES = {
  WRAPPED: 'wrapped',
  MINIMAL: 'minimal',
  GLASSMORPHISM: 'glassmorphism',
  BRUTALIST: 'brutalist',
  TICKET: 'ticket',
} as const;

/**
 * Period types
 */
export const TEMPLATE_PERIODS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

/**
 * Image capture settings
 */
export const IMAGE_CAPTURE_DEFAULTS = {
  FORMAT: 'png' as const,
  QUALITY: 1,
  RESULT: 'tmpfile' as const,
};

/**
 * Share actions
 */
export const SHARE_ACTIONS = {
  SAVE: 'save',
  SHARE: 'share',
  BOTH: 'both',
} as const;
