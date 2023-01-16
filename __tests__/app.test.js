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
