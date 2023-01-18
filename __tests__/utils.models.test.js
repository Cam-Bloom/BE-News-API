const { queryFormat } = require("../models/utils.models");

describe("queryFormat", () => {
  test("Given a single query object an object with values and sql code", () => {
    const input = { topic: "mitch" };

    const output = queryFormat(input);

    expect(typeof output).toBe("object");
  });

  test("Given a single query object return the correpsonding SQL string", () => {
    const input = { topic: "mitch" };

    const output = queryFormat(input);
    const expectedOutput = {
      valueArr: ["mitch"],
      sqlString: `WHERE articles.topic = $1GROUP BY articles.article_id ORDER BY created_at DESC;`,
    };

    expect(output.valueArr).toEqual(expectedOutput.valueArr);
    expect(output.sqlString).toEqual(expectedOutput.sqlString);
  });

  test("Given a sort by query add the revelant SQL command to string", () => {
    const input = { sort_by: "votes" };

    const output = queryFormat(input);
    const expectedOutput = {
      valueArr: [],
      sqlString: `GROUP BY articles.article_id ORDER BY votes DESC;`,
    };

    expect(output.valueArr).toEqual(expectedOutput.valueArr);
    expect(output.sqlString).toEqual(expectedOutput.sqlString);
  });

  test("Given a sort order query should return the correct object", () => {
    const input = { order: "ASC" };

    const output = queryFormat(input);
    const expectedOutput = {
      valueArr: [],
      sqlString: `GROUP BY articles.article_id ORDER BY created_at ASC;`,
    };

    expect(output.valueArr).toEqual(expectedOutput.valueArr);
    expect(output.sqlString).toEqual(expectedOutput.sqlString);
  });

  test("Given a object with multiple queries should return the correct object", () => {
    const input = { order: "ASC", sort_by: "votes", topic: "mitch" };

    const output = queryFormat(input);
    const expectedOutput = {
      valueArr: ["mitch"],
      sqlString: `WHERE articles.topic = $1GROUP BY articles.article_id ORDER BY votes ASC;`,
    };
    expect(output.valueArr).toEqual(expectedOutput.valueArr);
    expect(output.sqlString).toEqual(expectedOutput.sqlString);
  });

  test("When passed a invalid query key should return an error", () => {
    const input = { ordr: "ASC" };

    const { validationErr } = queryFormat(input);

    validationErr.catch((body) => {
      expect(body.msg).toBe("Bad Request");
    });
  });

  test("When passed a invalid query value should return an error", () => {
    const input = { order: "SC" };

    const { validationErr } = queryFormat(input);

    validationErr.catch((body) => {
      expect(body.msg).toBe("Bad Request");
    });
  });
});
