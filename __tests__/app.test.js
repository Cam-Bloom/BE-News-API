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
    test("200: Should recieve a 200 code for a sucessful request", () => {
      return request(app).get("/api/topics").expect(200);
    });

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

    test("500: Should respond with a 500 code if DB is not connected or seeded ", () => {
      return db
        .query(`DROP TABLE IF EXISTS comments;`)
        .then(() => {
          return db.query(`DROP TABLE IF EXISTS articles;`);
        })
        .then(() => {
          return db.query(`DROP TABLE IF EXISTS users;`);
        })
        .then(() => {
          return db.query(`DROP TABLE IF EXISTS topics;`);
        })
        .then(() => {
          request(app)
            .get("/api/topics")
            .expect(500)
            .then(({ body }) => {
              expect(body.msg).toBe("Internal Server Error");
            });
        });
    });
  });
});
