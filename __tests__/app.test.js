const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { ident } = require("pg-format");

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
          topicsArr.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test.skip('200: Should respond with a body of article with passed ID and corresponding properties" ', () => {
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
  });
});
