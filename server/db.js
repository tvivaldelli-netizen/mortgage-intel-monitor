// In-memory article storage
let articles = {};
let articleIds = [];

/**
 * Store an article in memory
 * @param {Object} article - Article object with title, summary, link, source, pubDate
 */
export async function saveArticle(article) {
  const articleId = article.link;

  // Clean and limit the data
  const articleData = {
    title: article.title || '',
    link: article.link || '',
    pubDate: article.pubDate || new Date().toISOString(),
    source: article.source || '',
    summary: (article.summary || '').substring(0, 500),
    originalContent: (article.originalContent || '').substring(0, 500),
    savedAt: new Date().toISOString()
  };

  articles[articleId] = articleData;
  if (!articleIds.includes(articleId)) {
    articleIds.push(articleId);
  }

  console.log(`[DB] ✓ Article saved: ${article.title.substring(0, 50)}`);
  return articleData;
}

/**
 * Retrieve all articles with optional filters
 * @param {Object} filters - { source, startDate, endDate, keyword }
 */
export async function getArticles(filters = {}) {
  try {
    const articleList = Object.values(articles);
    let filtered = articleList;

    // Apply filters
    if (filters.source) {
      filtered = filtered.filter(a => a.source === filters.source);
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(a => new Date(a.pubDate) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(a => new Date(a.pubDate) <= endDate);
    }

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(keyword) ||
        (a.summary && a.summary.toLowerCase().includes(keyword))
      );
    }

    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    console.log(`[DB] Retrieved ${filtered.length} articles`);
    return filtered;
  } catch (error) {
    console.error(`[DB] Error retrieving articles:`, error.message);
    return [];
  }
}

/**
 * Clear old articles (older than 90 days)
 */
export async function cleanOldArticles() {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const beforeCount = Object.keys(articles).length;
    const keysToDelete = [];

    for (const [key, article] of Object.entries(articles)) {
      if (new Date(article.pubDate) < ninetyDaysAgo) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => delete articles[key]);
    articleIds = articleIds.filter(id => !keysToDelete.includes(id));

    const removed = keysToDelete.length;
    console.log(`[DB] Cleaned ${removed} old articles`);
    return { removed };
  } catch (error) {
    console.error(`[DB] Error cleaning old articles:`, error.message);
    return { removed: 0 };
  }
}

export default { saveArticle, getArticles, cleanOldArticles };
