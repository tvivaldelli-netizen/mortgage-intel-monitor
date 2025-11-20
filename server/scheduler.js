import cron from 'node-cron';
import { fetchAllFeeds } from './rssFetcher.js';
import { cleanOldArticles } from './db.js';

/**
 * Initialize scheduled tasks
 */
export function initScheduler() {
  // Fetch news daily at 8 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('\n[Scheduler] Running daily news fetch at 8 AM...');
    try {
      await fetchAllFeeds();
      console.log('[Scheduler] Daily fetch completed successfully');
    } catch (error) {
      console.error('[Scheduler] Error during daily fetch:', error);
    }
  }, {
    timezone: 'America/New_York'
  });

  // Clean old articles weekly on Sunday at midnight
  cron.schedule('0 0 * * 0', async () => {
    console.log('\n[Scheduler] Running weekly cleanup...');
    try {
      const result = await cleanOldArticles();
      console.log(`[Scheduler] Cleanup completed. Removed ${result.removed} old articles`);
    } catch (error) {
      console.error('[Scheduler] Error during cleanup:', error);
    }
  }, {
    timezone: 'America/New_York'
  });

  console.log('✓ Scheduler initialized');
  console.log('  - Daily fetch: 8:00 AM EST');
  console.log('  - Weekly cleanup: Sunday 12:00 AM EST\n');
}
