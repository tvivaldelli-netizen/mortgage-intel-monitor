import { format } from 'date-fns';
import './ArticleCard.css';

export default function ArticleCard({ article }) {
  const formattedDate = format(new Date(article.pubDate), 'MMM dd, yyyy');

  return (
    <div className="article-card">
      <div className="article-header">
        <span className="article-source">{article.source}</span>
        <span className="article-date">{formattedDate}</span>
      </div>

      <h3 className="article-title">
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          {article.title}
        </a>
      </h3>

      <p className="article-summary">{article.summary}</p>

      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="read-more"
      >
        Read Full Article →
      </a>
    </div>
  );
}
