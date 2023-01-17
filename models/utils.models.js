function queryFormat(query) {
  let sqlString = "";
  let valueArr = [];
  const validOrder = ["ASC", "DESC"];
  const validSortBy = ["created_at", "comment_count", "article_id", "votes"];

  if (query.topic) {
    sqlString += `WHERE articles.topic = $1`;
    valueArr.push(query.topic);
  }
  if (query.order) {
    sqlString += `
    GROUP BY 1,2,3,4,5,6,7
    ORDER BY created_at ${query.order};`;
  } else if (query.sort_by) {
    sqlString += `
    GROUP BY 1,2,3,4,5,6,7
    ORDER BY ${query.sort_by} DESC;`;
  } else {
    sqlString += `
    GROUP BY 1,2,3,4,5,6,7
    ORDER BY created_at DESC;`;
  }

  return { valueArr, sqlString };
}

module.exports = { queryFormat };
