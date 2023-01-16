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
