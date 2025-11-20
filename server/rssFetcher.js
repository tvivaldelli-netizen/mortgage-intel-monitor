import Parser from 'rss-parser';
import { readFile } from 'fs/promises';
import { summarizeArticle } from './claudeSummarizer.js';
import { saveArticle } from './db.js';

const parser = new Parser({
  customFields: {
    item: ['description', 'content:encoded', 'summary']
  }
});

/**
 * Load news sources from configuration
 */
async function loadSources() {
  try {
    const data = await readFile('./sources.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading sources.json:', error);
    return { sources: [] };
  }
}

/**
 * Fetch RSS feed from a single source
 */
async function fetchRSS(source) {
  try {
    console.log(`Fetching RSS from ${source.name}...`);
    const feed = await parser.parseURL(source.rss);

    const articles = [];

    for (const item of feed.items.slice(0, 10)) { // Limit to 10 most recent items
      try {
        // Extract content
        const content = item['content:encoded'] || item.description || item.summary || '';

        // Generate summary using Claude
        const summary = await summarizeArticle(item.title, content);

        const article = {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          source: source.name,
          summary: summary,
          originalContent: content.substring(0, 500) // Store first 500 chars
        };

        // Save to database
        await saveArticle(article);
        articles.push(article);

        console.log(`✓ Saved: ${item.title}`);
      } catch (error) {
        console.error(`Error processing article "${item.title}":`, error.message);
      }
    }

    return articles;
  } catch (error) {
    console.error(`Error fetching RSS from ${source.name}:`, error.message);
    return [];
  }
}

/**
 * Fetch all RSS feeds from configured sources
 */
export async function fetchAllFeeds() {
  const config = await loadSources();
  const allArticles = [];

  console.log(`\nFetching from ${config.sources.length} sources...`);

  for (const source of config.sources) {
    const articles = await fetchRSS(source);
    allArticles.push(...articles);

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n✓ Total articles fetched: ${allArticles.length}\n`);
  return allArticles;
}

/**
 * Get list of configured sources
 */
export async function getSources() {
  const config = await loadSources();
  return config.sources;
}
