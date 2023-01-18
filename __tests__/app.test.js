const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

//SETUP AND SHUTDOWN
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

// TEST SUITE
describe("/api/topics", () => {
  describe("GET", () => {
    test('200: Should respond with a body of topic objects in an array, with "slug" and "description properties"', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topicsArr = body.topics;

          expect(Array.isArray(topicsArr)).toBe(true);
          expect(topicsArr.length).toBe(3);
          topicsArr.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test('200: Should respond with a body of article objects in an array, with corresponding properties"', () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articleArr = body.articles;

          expect(Array.isArray(articleArr)).toBe(true);
          articleArr.forEach((topic) => {
            expect(topic).toHaveProperty("author");
            expect(topic).toHaveProperty("title");
            expect(topic).toHaveProperty("article_id");
            expect(topic).toHaveProperty("topic");
            expect(topic).toHaveProperty("created_at");
            expect(topic).toHaveProperty("votes");
            expect(topic).toHaveProperty("article_img_url");
            expect(topic).toHaveProperty("comment_count");
          });
        });
    });

    test("200: Should respond sorted in descending date order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articleArr = body.articles;

          expect(articleArr).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test('200: Should respond with a body of article with passed ID and corresponding properties" ', () => {
      const id = 3;

      return request(app)
        .get(`/api/articles/${id}`)
        .expect(200)
        .then(({ body }) => {
          const article = body.article;

          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id", id);
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });

    test("400: Should respond with Bad Request for invalid id", () => {
      const id = "Cheese";

      return request(app)
        .get(`/api/articles/${id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("404: Should respond with Not Found for id not in database ", () => {
      return request(app)
        .get(`/api/articles/999`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });

  describe("PATCH", () => {
    test("200: Should respond with the updated object with incremented votes", () => {
      const id = 1;

      return request(app)
        .patch(`/api/articles/${id}`)
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          const article = body.article;

          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id", id);
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes", 101);
          expect(article).toHaveProperty("article_img_url");
        });
    });

    test("400: Should respond with bad request for invalid body", () => {
      const id = 1;

      return request(app)
        .patch(`/api/articles/${id}`)
        .send({ ic_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("404: Should respond with not found for an id which is not in the database", () => {
      const id = 999;

      return request(app)
        .patch(`/api/articles/${id}`)
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });

    test("400: Should respond with bad request for invalid id type", () => {
      const id = "cheese";

      return request(app)
        .patch(`/api/articles/${id}`)
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("400: Should respond with bad request for invalid body", () => {
      const id = 1;

      return request(app)
        .patch(`/api/articles/${id}`)
        .send({ inc_votes: "cheese" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: Should respond with comment objects with relevent properties for a passed articel parameter", () => {
      const id = 3;

      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(200)
        .then(({ body }) => {
          const commentsArr = body.comments;

          expect(Array.isArray(commentsArr)).toBe(true);
          expect(commentsArr.length).toBe(2);

          commentsArr.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment).toHaveProperty("article_id", id);
          });
        });
    });

    test("200: Should respond with empty for a valid article with no comments", () => {
      const id = 8;

      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(200)
        .then(({ body }) => {
          const commentsArr = body.comments;

          expect(commentsArr).toEqual([]);
        });
    });

    test("200: Should respond with most recent comments first", () => {
      const id = 3;

      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(200)
        .then(({ body }) => {
          const commentsArr = body.comments;

          expect(commentsArr).toBeSortedBy("created_at", { descending: true });
        });
    });

    test("404: Should respond with not found for an article id not in the db", () => {
      const id = 999;

      return request(app)
        .get(`/api/articles/${id}/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("POST", () => {
    test('201: Should respond with newly created comment object when passed a "body" and "username"', () => {
      const id = 3;

      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({
          body: "Cool new comment",
          username: "butter_bridge",
        })
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;

          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author", "butter_bridge");
          expect(comment).toHaveProperty("body", "Cool new comment");
          expect(comment).toHaveProperty("article_id", id);
        });
    });

    test("400: Should respond with bad request for invalid body on req", () => {
      const id = 3;

      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({
          bod: "Cool new comment",
          usename: "butter_bridge",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("404: Should respond with not found for a id that does not have corresponding article", () => {
      const id = "999";

      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({
          body: "Cool new comment",
          username: "butter_bridge",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });

    test("400: Should respond with bad request for no value on req", () => {
      const id = 3;

      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({
          body: undefined,
          username: undefined,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("404: Should respond with not found if username is not in database", () => {
      const id = "1";

      return request(app)
        .post(`/api/articles/${id}/comments`)
        .send({
          body: "Cool new comment",
          username: "random",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test('200: Should return an array of user objects with "username", "name" and "avatar_url" properties', () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const usersArr = body.users;

          expect(Array.isArray(usersArr)).toBe(true);
          expect(usersArr.length).toBe(4);
          usersArr.forEach((topic) => {
            expect(topic).toHaveProperty("username");
            expect(topic).toHaveProperty("name");
            expect(topic).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
