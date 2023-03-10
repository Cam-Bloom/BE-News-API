const fs = require("fs/promises");
const db = require("../db/connection");
const { queryFormat } = require("./utils.models");

function fetchDesc() {
	return fs.readFile(__dirname + "/endpoints.json").then((body) => {
		return JSON.parse(body);
	});
}

function fetchAllTopics() {
	const sqlQuery = `SELECT * FROM topics`;

	return db.query(sqlQuery).then(({ rows: topics }) => {
		return topics;
	});
}

function fetchAllArticles(query) {
	let sqlQuery = `
    SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    USING (article_id)`;

	const { valueArr, sqlString, validationErr } = queryFormat(query);

	if (validationErr) return validationErr;
	if (sqlString) sqlQuery += sqlString;

	return db.query(sqlQuery, valueArr).then(({ rows: articles, rowCount }) => {
		return rowCount === 0 ? Promise.reject({ status: 404, msg: "Not Found" }) : articles;
	});
}

function fetchArticleById(id) {
	const sqlQuery = `
  SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments
  USING (article_id)
  WHERE article_id = $1
  GROUP BY 1,2,3,4,5,6,7
  `;

	return db.query(sqlQuery, [id]).then(({ rows: [article] }) => {
		return article ? article : Promise.reject({ status: 404, msg: "Not Found" });
	});
}

function fetchCommentsByArticleId(id, { limit = 10, p }) {
	const valueArr = [id, limit];
	let paramCounter = 1;

	let sqlQuery = `
  SELECT * 
  FROM comments
  WHERE article_id = $${paramCounter++}
  ORDER BY created_at DESC
  LIMIT $${paramCounter++}
  `;

	if (p) {
		sqlQuery += ` OFFSET $${paramCounter++}`;
		const offsetNum = p * limit - limit;
		valueArr.push(offsetNum);
	}

	return db
		.query(sqlQuery, valueArr)
		.then(({ rows: comments, rowCount }) => {
			if (rowCount > 0) return { comments };

			sqlQuery = `SELECT * 
      FROM comments
      WHERE article_id = $1`;

			return db.query(sqlQuery, [id]);
		})
		.then(({ comments, rowCount }) => {
			if (comments) return comments;

			return rowCount === 0 ? [] : Promise.reject({ status: 404, msg: "Not Found" });
		});
}

function createComment(id, body) {
	if (body.body && body.username) {
		const inputValues = [body.body, body.username, id];

		const sqlQuery = `
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `;

		return db.query(sqlQuery, inputValues).then(({ rows: [comment] }) => {
			return comment;
		});
	} else {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}
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

function fetchAllUsers() {
	const sqlQuery = `
  SELECT * 
  FROM users`;

	return db.query(sqlQuery).then(({ rows: users }) => {
		return users;
	});
}

function removeCommentById(id) {
	const sqlQuery = `
  DELETE FROM comments
  WHERE comment_id = $1`;

	return db.query(sqlQuery, [id]).then(({ rowCount }) => {
		if (rowCount === 0) return Promise.reject({ status: 404, msg: "Not Found" });
	});
}

function fetchUserByUsername(username) {
	const sqlQuery = `
  SELECT * 
  FROM users
  WHERE username = $1`;

	return db.query(sqlQuery, [username]).then(({ rows: [user] }) => {
		return user ? user : Promise.reject({ status: 404, msg: "Not Found" });
	});
}

function updateCommentVotes(id, { inc_votes }) {
	const valueArr = [inc_votes, id];

	const sqlQuery = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`;

	return db.query(sqlQuery, valueArr).then(({ rows: [updatedComment] }) => {
		return updatedComment ? updatedComment : Promise.reject({ status: 404, msg: "Not Found" });
	});
}

function createNewArticle(body) {
	const inputValues = [body.author, body.title, body.body, body.topic, body.article_img_url];

	const sqlQuery = `
    INSERT INTO articles
    ( author, title, body, topic, article_img_url )
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *`;

	return db.query(sqlQuery, inputValues).then(({ rows: [article] }) => {
		return article;
	});
}

function fetchTopicBySlug(slug) {
	const sqlQuery = `
    SELECT * 
    FROM topics
    WHERE slug = $1`;

	return db.query(sqlQuery, [slug]).then(({ rows: [topic] }) => {
		return topic ? topic : Promise.reject({ status: 404, msg: "Not Found" });
	});
}

function createNewTopic(body) {
	const valueArr = [body.slug, body.description];

	sqlQuery = `
    INSERT INTO topics
    ( slug, description )
    VALUES
    ($1, $2)
    RETURNING *`;

	return db.query(sqlQuery, valueArr).then(({ rows: [topic] }) => {
		return topic;
	});
}

function removeArticleById(id) {
	let sqlQuery = `
    DELETE FROM comments
    WHERE article_id = $1`;

	return db.query(sqlQuery, [id]).then(() => {
		sqlQuery = `
    DELETE FROM articles
    WHERE article_id = $1`;

		return db.query(sqlQuery, [id]);
	});
}

function createNewUser(body) {
	const valueArr = [body.username, body.name, body.avatar_url];

	const sqlQuery = `
  INSERT INTO users
  (username, name, avatar_url)
  VALUES
  ($1, $2, $3)
  RETURNING *`;

	return db.query(sqlQuery, valueArr).then(({ rows: [user] }) => {
		return user;
	});
}

module.exports = {
	fetchDesc,
	fetchAllTopics,
	fetchArticleById,
	fetchAllArticles,
	fetchCommentsByArticleId,
	createComment,
	updateArticleVotes,
	fetchAllUsers,
	removeCommentById,
	fetchUserByUsername,
	updateCommentVotes,
	createNewArticle,
	fetchTopicBySlug,
	createNewTopic,
	removeArticleById,
	createNewUser,
};
