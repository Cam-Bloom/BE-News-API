function queryFormat(query) {
  let sqlString = "";
  let valueArr = [];
  const validOrder = ["ASC", "DESC"];
  const validSortBy = ["created_at", "comment_count", "article_id", "votes"];
  const validQuery = ["topic", "order", "sort_by"];

  //BAD REQUEST
  const keys = Object.keys(query);
  const validateKeyBoolean = keys.some((query) => validQuery.includes(query));

  if (!validateKeyBoolean && keys.length > 0) {
    return {
      validationErr: Promise.reject({ status: 400, msg: "Bad Request" }),
    };
  }

  if (keys.includes("order") || keys.includes("sort_by")) {
    const values = [query.order, query.sort_by];
    const combValidValues = validOrder.concat(validSortBy);
    const validateValueBoolean = values.some((value) =>
      combValidValues.includes(value)
    );

    if (!validateValueBoolean) {
      return {
        validationErr: Promise.reject({ status: 400, msg: "Bad Request" }),
      };
    }
  }

  //SQL STRING ADD-ON
  if (query.topic) {
    sqlString += `WHERE articles.topic = $1`;
    valueArr.push(query.topic);
  }

  sqlString += "GROUP BY 1,2,3,4,5,6,7";

  if (query.order && query.sort_by) {
    sqlString += `ORDER BY ${query.sort_by} ${query.order};`;
  } else if (query.order) {
    sqlString += `ORDER BY created_at ${query.order};`;
  } else if (query.sort_by) {
    sqlString += `ORDER BY ${query.sort_by} DESC;`;
  } else {
    sqlString += `ORDER BY created_at DESC;`;
  }

  return { valueArr, sqlString };
}

module.exports = { queryFormat };
