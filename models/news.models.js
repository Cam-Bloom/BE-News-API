const db = require("../db/connection");

function fetchAllTopics() {
  const sqlQuery = `SELECT * FROM topics`;

  return db.query(sqlQuery).then(({ rows: topics }) => {
    return topics;
  });
}

module.exports = { fetchAllTopics };
