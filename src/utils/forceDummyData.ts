import { forceRegenerateDummyData } from './dummyData';

/**
 * Global function for forcing dummy data regeneration
 * Can be called from browser console or React DevTools
 */
if (__DEV__) {
  // @ts-ignore - Global function for development
  global.forceRegenerateDummyData = forceRegenerateDummyData;
  console.log('[ForceDummyData] 💡 Use forceRegenerateDummyData() to regenerate dummy data');
}
