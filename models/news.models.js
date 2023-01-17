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
    ORDER BY created_at DESC;`;

  return db.query(sqlQuery).then(({ rows: articles }) => {
    return articles;
  });
}

function fetchArticleById(id) {
  const sqlQuery = `
  SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
  FROM articles
  WHERE article_id = $1
  `;

  return db.query(sqlQuery, [id]).then(({ rows: [article] }) => {
    return article
      ? article
      : Promise.reject({ status: 404, msg: "Not Found" });
  });
}

function fetchCommentsByArticleId(id) {
  const sqlQuery = `
  SELECT * 
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;
  `;
  return db.query(sqlQuery, [id]).then(({ rows: comments, rowCount }) => {
    return comments;
  });
}

function updateArticleVotes(id, { inc_votes }) {
  const valueArr = [inc_votes, id];

  const sqlQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`;

  return db.query(sqlQuery, valueArr).then(({ rows: [updatedArticle] }) => {
    return updatedArticle;
  });
}

module.exports = {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  updateArticleVotes,
};
