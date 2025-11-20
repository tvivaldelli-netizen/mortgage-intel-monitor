import Anthropic from '@anthropic-ai/sdk';
import { load } from 'cheerio';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Strip HTML tags from content
 */
function stripHtml(html) {
  const $ = load(html);
  return $.text().trim();
}

/**
 * Summarize an article using Claude Haiku API
 * @param {string} title - Article title
 * @param {string} content - Article content (may contain HTML)
 * @returns {Promise<string>} - Summary of the article
 */
export async function summarizeArticle(title, content) {
  try {
    // Strip HTML tags
    const cleanContent = stripHtml(content);

    // If content is too short, return as is
    if (cleanContent.length < 100) {
      return cleanContent;
    }

    // Truncate very long content to reduce token usage
    const truncatedContent = cleanContent.substring(0, 3000);

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Summarize the following mortgage industry news article in 2-3 concise sentences. Focus on the key facts and implications for the mortgage industry.

Title: ${title}

Content: ${truncatedContent}

Summary:`
      }]
    });

    // Extract the summary from Claude's response
    const summary = message.content[0].text.trim();
    return summary;

  } catch (error) {
    console.error('Error summarizing article with Claude:', error.message);

    // Fallback: return first 200 characters if API fails
    const cleanContent = stripHtml(content);
    return cleanContent.substring(0, 200) + '...';
  }
}
