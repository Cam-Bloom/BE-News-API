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
describe("/api", () => {
	describe("GET", () => {
		test("200: Should return a object which contains paths and descriptions", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body }) => {
					const expected = {
						"GET /api": {
							description:
								"serves up a json representation of all the available endpoints of the api",
						},
						"GET /api/topics": {
							description: "serves an array of all topics",
							queries: [],
							exampleResponse: {
								topics: [{ slug: "football", description: "Footie!" }],
							},
						},
						"GET /api/topics/:slug": {
							description: "serves an array of a topic by slug",
							queries: [],
							exampleResponse: {
								topics: [{ slug: "football", description: "Footie!" }],
							},
						},

						"GET /api/articles": {
							description: "serves an array of all articles",
							queries: ["topic", "sort_by", "order", "limit", "p", "total"],
							exampleResponse: {
								articles: [
									{
										title: "Seafood substitutions are increasing",
										topic: "cooking",
										author: "weegembump",
										body: "Text from the article..",
										created_at: 1527695953341,
									},
								],
							},
						},

						"POST /api/articles": {
							description: "Creates a new article",
							queries: [],
							exampleResponse: {
								article: {
									author: "icellusedkars",
									title: "Eight pug gifs that remind me of mitch",
									article_id: 3,
									body: "some gifs",
									topic: "mitch",
									created_at: "2020-11-03T09:12:00.000Z",
									votes: 0,
									article_img_url:
										"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
									comment_count: 2,
								},
							},
						},
						"GET /api/articles/:article_id": {
							description: "serves an specific article from article id",
							queries: [],
							exampleResponse: {
								article: {
									author: "icellusedkars",
									title: "Eight pug gifs that remind me of mitch",
									article_id: 3,
									body: "some gifs",
									topic: "mitch",
									created_at: "2020-11-03T09:12:00.000Z",
									votes: 0,
									article_img_url:
										"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
									comment_count: 2,
								},
							},
						},
						"PATCH /api/articles/:article_id": {
							description: "Increments a articles vote count",
							queries: [],
							exampleResponse: {
								article: {
									article_id: 1,
									title: "Living in the shadow of a great man",
									topic: "mitch",
									author: "butter_bridge",
									body: "I find this existence challenging",
									created_at: "2020-07-09T20:11:00.000Z",
									votes: 101,
									article_img_url:
										"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
								},
							},
						},
						"DELETE /api/articles/:article_id": {
							description: "Deletes a comment by specificed id",
							queries: [],
							exampleResponse: {},
						},
						"GET /api/articles/:article_id/comments": {
							description: "serves an comments from article id",
							queries: ["limit", "p"],
							exampleResponse: {
								comments: [
									{
										comment_id: 11,
										body: "Ambidextrous marsupial",
										article_id: 3,
										author: "icellusedkars",
										votes: 0,
										created_at: "2020-09-19T23:10:00.000Z",
									},
									{
										comment_id: 10,
										body: "git push origin master",
										article_id: 3,
										author: "icellusedkars",
										votes: 0,
										created_at: "2020-06-20T07:24:00.000Z",
									},
								],
							},
						},
						"POST /api/articles/:article_id/comments": {
							description: "Posts an comments to a specific article id",
							queries: [],
							exampleResponse: {
								comment: {
									comment_id: 19,
									body: "Cool new comment",
									article_id: 3,
									author: "butter_bridge",
									votes: 0,
									created_at: "2023-01-19T10:11:01.416Z",
								},
							},
						},
						"GET /api/users": {
							description: "Serves an array of all users",
							queries: [],
							exampleResponse: {
								users: [
									{
										username: "butter_bridge",
										name: "jonny",
										avatar_url:
											"https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
									},
									{
										username: "icellusedkars",
										name: "sam",
										avatar_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
									},
									{
										username: "rogersop",
										name: "paul",
										avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
									},
									{
										username: "lurker",
										name: "do_nothing",
										avatar_url:
											"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
									},
								],
							},
						},
						"DELETE /api/comments/:comment_id": {
							description: "Deletes a comment by a specific id",
							queries: [],
							exampleResponse: {},
						},
						"PATCH /api/comments/:comment_id": {
							description: "Increments a comments vote count",
							queries: [],
							exampleResponse: {
								comment: {
									comment_id: 2,
									body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
									article_id: 1,
									author: "butter_bridge",
									votes: 19,
									created_at: "2020-10-31T03:03:00.000Z",
								},
							},
						},
					};
					expect(body).toEqual(expected);
				});
		});
	});
});

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

	describe("POST", () => {
		test("201: Should create a new topic with slug and description", () => {
			return request(app)
				.post("/api/topics")
				.send({
					slug: "New Topic",
					description: "Amazing new topic",
				})
				.then(({ body }) => {
					const topic = body.topic;

					expect(topic).toHaveProperty("slug");
					expect(topic).toHaveProperty("description");
				});
		});

		test("400: Should return bad request for error in the key", () => {
			return request(app)
				.post("/api/topics")
				.send({
					sug: "New Topic",
					description: "Amazing new topic",
				})
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("400: Should return bad request for undefined in the value", () => {
			return request(app)
				.post("/api/topics")
				.send({
					slug: undefined,
					description: "Amazing new topic",
				})
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});
	});
});

describe("/api/topics/:slug", () => {
	describe("GET", () => {
		test("200: Should get topic by slug", () => {
			return request(app)
				.get("/api/topics/mitch")
				.expect(200)
				.then(({ body }) => {
					const topic = body.topic;

					expect(topic).toHaveProperty("slug", "mitch");
					expect(topic).toHaveProperty("description");
				});
		});

		test("404: Should return not found if the slug is not in the database", () => {
			return request(app)
				.get("/api/topics/notatopic")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
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
					articleArr.forEach((article) => {
						expect(article).toHaveProperty("author");
						expect(article).toHaveProperty("title");
						expect(article).toHaveProperty("article_id");
						expect(article).toHaveProperty("topic");
						expect(article).toHaveProperty("created_at");
						expect(article).toHaveProperty("votes");
						expect(article).toHaveProperty("article_img_url");
						expect(article).toHaveProperty("comment_count");
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

		test("200: Should respond with filtered results by topic when passed a topic query", () => {
			return request(app)
				.get("/api/articles?topic=mitch")
				.expect(200)
				.then(({ body }) => {
					const articleArr = body.articles;
					console.log(articleArr);
					expect(Array.isArray(articleArr)).toBe(true);
					articleArr.forEach((topic) => {
						expect(topic).toHaveProperty("topic", "mitch");
					});
				});
		});

		test("200: Should respond with sorted by any valid category", () => {
			return request(app).get("/api/articles?sort_by=votes").expect(200);
		});

		test("200: Should be able to handle multiple queries", () => {
			return request(app)
				.get("/api/articles?order=ASC&sort_by=votes&topic=mitch")
				.expect(200)
				.then(({ body }) => {
					const articleArr = body.articles;

					expect(Array.isArray(articleArr)).toBe(true);
					expect(articleArr).toBeSortedBy("votes", { ascending: true });
					articleArr.forEach((topic) => {
						expect(topic).toHaveProperty("topic", "mitch");
					});
				});
		});

		test("400: Should recieve bad request if query key is invalid", () => {
			return request(app)
				.get("/api/articles?oder=ASC")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("400: Should recieve bad request if query value is invalid", () => {
			return request(app)
				.get("/api/articles?order=bananas")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("404: Should recieve not found when a valid but not existant topic ", () => {
			return request(app)
				.get("/api/articles?topic=randomTopic")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});

		test("200: Should return the query with limit default of 10 results", () => {
			return request(app)
				.get("/api/articles?limit=5")
				.expect(200)
				.then(({ body }) => {
					const articleArr = body.articles;

					expect(articleArr.length).toBe(5);
				});
		});

		test("200: Should return the query with p which represents the page number", () => {
			return request(app)
				.get("/api/articles?limit=10&p=2")
				.expect(200)
				.then(({ body }) => {
					const articleArr = body.articles;

					expect(articleArr.length).toBe(2);
				});
		});

		test("200: Should return with a property of total count", () => {
			return request(app)
				.get("/api/articles?limit=10&p=2")
				.expect(200)
				.then(({ body }) => {
					expect(body).toHaveProperty("total_count", 10);
				});
		});

		test("400: Should return bad request for invalid limit", () => {
			return request(app)
				.get("/api/articles?limit=cheese")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("400: Should return bad request for invalid page", () => {
			return request(app)
				.get("/api/articles?p=cheese")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("404: Should return not found for a page number which does not contain any articles", () => {
			return request(app)
				.get("/api/articles?p=100000000")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});

	describe("POST", () => {
		test("201: Should create a new article and respond with the corresponding object ", () => {
			return request(app)
				.post("/api/articles")
				.send({
					author: "lurker",
					title: "the best article",
					body: "abcdef",
					topic: "mitch",
					article_img_url: "www.gooodle.com",
				})
				.expect(201)
				.then(({ body }) => {
					const article = body.article;

					expect(article).toHaveProperty("author");
					expect(article).toHaveProperty("title");
					expect(article).toHaveProperty("article_id");
					expect(article).toHaveProperty("topic");
					expect(article).toHaveProperty("created_at");
					expect(article).toHaveProperty("votes");
					expect(article).toHaveProperty("article_img_url");
					expect(article).toHaveProperty("comment_count");
				});
		});

		test("404: Should return bad request for invalid value on topic not in database", () => {
			return request(app)
				.post("/api/articles")
				.send({
					author: "lurker",
					title: "the best article",
					body: "abcdef",
					topic: "notatopic",
					article_img_url: "www.gooodle.com",
				})
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});

		test("404: Should return bad request for invalid value on author not in database", () => {
			return request(app)
				.post("/api/articles")
				.send({
					author: "luer",
					title: "the best article",
					body: "abcdef",
					topic: "notatopic",
					article_img_url: "www.gooodle.com",
				})
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
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

		test("200: Should respond with article with a comment count property", () => {
			const id = 1;

			return request(app)
				.get(`/api/articles/${id}`)
				.expect(200)
				.then(({ body }) => {
					const article = body.article;

					expect(article).toHaveProperty("comment_count");
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

	describe("DELETE", () => {
		test("204: Should remove an article from database by Id", () => {
			const id = 1;

			return request(app)
				.delete(`/api/articles/${id}`)
				.expect(204)
				.then(() => {
					return db.query(`SELECT * FROM articles WHERE article_id = ${id}`);
				})
				.then(({ rowCount }) => {
					expect(rowCount).toBe(0);
				});
		});

		test("400: Should return bad request for invalid id", () => {
			const id = "cheeezxe";

			return request(app)
				.delete(`/api/articles/${id}`)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("404: Should return not found for an id that does not exist", () => {
			const id = 999999;

			return request(app)
				.delete(`/api/articles/${id}`)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});
	describe("GET", () => {
		test("200: Should respond with comment objects with relevent properties for a passed article parameter", () => {
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

		test("200: Should accept a limit query for the results", () => {
			const id = 1;

			return request(app)
				.get(`/api/articles/${id}/comments?limit=5`)
				.expect(200)
				.then(({ body }) => {
					const commentsArr = body.comments;

					expect(commentsArr.length).toBe(5);
				});
		});

		test("200: Should accept a page query for the results", () => {
			const id = 1;

			return request(app)
				.get(`/api/articles/${id}/comments?p=4&limit=3`)
				.expect(200)
				.then(({ body }) => {
					const commentsArr = body.comments;

					expect(commentsArr.length).toBe(2);
				});
		});

		test("400: Should return bad request for invalid limit amount", () => {
			const id = 1;

			return request(app)
				.get(`/api/articles/${id}/comments?limit=chheeeeze`)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("400: Should return bad request for invalid page amount", () => {
			const id = 1;

			return request(app)
				.get(`/api/articles/${id}/comments?p=chheeeeze`)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("404: Should return not found for page number higher that would exceed the number of comments", () => {
			const id = 1;

			return request(app)
				.get(`/api/articles/${id}/comments?p=999`)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});

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

	describe("POST", () => {
		test("201: Should create a new user and return the object", () => {
			return request(app)
				.post("/api/users")
				.send({
					username: "cammy_B",
					name: "Cam",
					avatar_url: "www.googole.com",
				})
				.expect(201)
				.then(({ body }) => {
					const newUser = body.user;

					expect(newUser).toEqual({
						username: "cammy_B",
						name: "Cam",
						avatar_url: "www.googole.com",
					});
				});
		});
	});
});

describe("/api/comments/:comment_id", () => {
	describe("DELETE", () => {
		test("204: Should respond with no content and item should be deleted", () => {
			const id = 1;

			return request(app)
				.delete(`/api/comments/${id}`)
				.expect(204)
				.then(() => {
					return db.query(`SELECT * FROM comments WHERE comment_id = ${id}`);
				})
				.then(({ rowCount }) => {
					expect(rowCount).toBe(0);
				});
		});

		test("400: Should respond with bad request for a invalid id", () => {
			const id = "cheese";

			return request(app)
				.delete(`/api/comments/${id}`)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("404: Should respond with not found for item not in the database", () => {
			const id = 100000;

			return request(app)
				.delete(`/api/comments/${id}`)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});

	describe("PATCH", () => {
		test("200: When sent a inc_votes object should increment the votes by the amount and respond with updated comment", () => {
			const id = 2;

			return request(app)
				.patch(`/api/comments/${id}`)
				.send({ inc_votes: 5 })
				.expect(200)
				.then(({ body }) => {
					const comment = body.comment;

					expect(comment).toHaveProperty("comment_id", id);
					expect(comment).toHaveProperty("body");
					expect(comment).toHaveProperty("article_id");
					expect(comment).toHaveProperty("author");
					expect(comment).toHaveProperty("votes", 19);
					expect(comment).toHaveProperty("created_at");
				});
		});

		test("400: Should return bad request when invalid req body value", () => {
			const id = 2;

			return request(app)
				.patch(`/api/comments/${id}`)
				.send({ inc_votes: "cheeese" })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("400: Should return bad request when invalid req body key", () => {
			const id = 2;

			return request(app)
				.patch(`/api/comments/${id}`)
				.send({ incjksk: 234 })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("400: Should return bad request when invalid id", () => {
			const id = "cheesee";

			return request(app)
				.patch(`/api/comments/${id}`)
				.send({ incjksk: 234 })
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});

		test("404: Should return not found when valid id but not in the database", () => {
			const id = 20000000;

			return request(app)
				.patch(`/api/comments/${id}`)
				.send({ incjksk: 234 })
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});
});

describe("/api/users/:username", () => {
	describe("GET", () => {
		test("200: Should respond with user object with specified id with correct properties", () => {
			const id = "icellusedkars";

			return request(app)
				.get(`/api/users/${id}`)
				.expect(200)
				.then(({ body }) => {
					const user = body.user;

					expect(user).toHaveProperty("username", id);
					expect(user).toHaveProperty("name");
					expect(user).toHaveProperty("avatar_url");
				});
		});

		test("404: Should respond with not found if username cannot be found", () => {
			const id = "notausername";

			return request(app)
				.get(`/api/users/${id}`)
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});
});
