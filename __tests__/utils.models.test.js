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
      sqlString: `WHERE articles.topic = $1
      GROUP BY 1,2,3,4,5,6,7
      ORDER BY created_at DESC;`,
    };

    expect(output.valueArr).toEqual(expectedOutput.valueArr);
    expect(output).toHaveProperty("sqlString");
  });

  test("Given a sort by query add the revelant SQL command to string", () => {
    const input = { sort_by: "votes" };

    const output = queryFormat(input);
    const expectedOutput = {
      valueArr: [],
      sqlString: `GROUP BY 1,2,3,4,5,6,7
        ORDER BY votes DESC;`,
    };

    expect(output.valueArr).toEqual(expectedOutput.valueArr);
    expect(output).toHaveProperty("sqlString");
  });

  test("Given a sort order query should return the correct object", () => {
    const input = { order: "ASC" };
    const output = queryFormat(input);
    const expectedOutput = {
      valueArr: [],
      sqlString: `GROUP BY 1,2,3,4,5,6,7
        ORDER BY created_at ASC;`,
    };

    expect(output.valueArr).toEqual(expectedOutput.valueArr);
    expect(output).toHaveProperty("sqlString");
  });
});
