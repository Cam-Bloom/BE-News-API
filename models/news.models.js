const db = require("../db/connection");

function fetchAllTopics() {
  const sqlQuery = `SELECT * FROM topics`;

  return db.query(sqlQuery).then(({ rows: topics }) => {
    return topics;
  });
}

function fetchAllArticles() {
  const sqlQuery = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    JOIN comments
    USING (article_id)
    GROUP BY 1,2,3,4,5,6,7
    ORDER BY articles.created_at DESC;`;

  return db.query(sqlQuery).then(({ rows: articles }) => {
    console.log(articles);
    return articles;
  });
}

module.exports = { fetchAllTopics, fetchAllArticles };
