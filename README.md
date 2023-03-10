# **CB News API**

[![Technologies Used](https://skillicons.dev/icons?i=js,nodejs,express,postgres,git,jest)](https://skillicons.dev)

## 📝 **Summary**

This is an API for news articles🗞️. From this api you can fetch articles, comments and user, post new comments, increment vote counts on articles, delete commen,ts and filter articles via queries.

### API Link

Use the following link with request paths below to access the api:

```
https://cb-news-api.onrender.com
```

This can be used on platforms such as [Insomia](https://insomnia.rest/) or [Postman](https://www.postman.com/) with the respective paths.

### Paths

Get full JSON information on paths by the following request:

```
https://cb-news-api.onrender.com/api
```

Here is the tabulated endpoints:
|Endpoint path|Description|Queries|
|-------------|-----------|-------|
|**GET** /api |Serves up a json representation of all the available endpoints of the api|
|**GET** /api/topics|Serves an array of all topics|
|**GET** /api/topics/:slug|Serves an array of a topic by slug
**GET** /api/articles|Serves an array of all articles|topic, sort_by, order, limit, p, total
**POST** /api/articles|Creates a new article
**GET** /api/articles/:article_id|Serves an specific article from article id
**PATCH** /api/articles/:article_id|Increments a articles vote count
**DELETE** /api/articles/:article_id|Deletes a comment by specificed id
**GET** /api/articles/:article_id/comments|Serves an comments from article id|limit, p
**POST** /api/articles/:article_id/comments|Posts an comments to a specific article id
**GET** /api/users|Serves an array of all users
**DELETE** /api/comments/:comment_id|Deletes a comment by a specific id
**PATCH** /api/comments/:comment_id|Increments a comments vote count

## 🚀 **Getting Started**

### GitHub Forking and Cloning

To get started you must first **fork** this repo, do this by the "fork" button on the top right of the screen.

Once you have forked this repo to our own account you should your own link. Open your terminal and navigate to location where you would like this file, now use the following command with your url:

```
git clone <your_url>
```

You should now have your own copy of the api which can be opened in your IDE of choice.

### npm and Dependancies

To ensure the code works as designed you will need to install some npm packages this can be all be done by the following command in your terminal

```
npm install
```

### .env Files

The api requiries different enviroments for development and testing therefore we need 2 .env files which set envrioment varibles, they are as follows:

### .env.development

After making this file input the following code:

```
PGDATABASE=nc_news
```

### .env.test

After making this file input the following code:

```
PGDATABASE=nc_news_test
```

### Seeding

To seed the database the following commands have to be run, the first will create the PSQL databases the second will seed them from the data files.

```
npm run setup-dbs
npm run seed
```

### Testing

Now to check if everything is working, to run all test suites run the following in the terminal:

```
npm test
```

To run tests only for the app itself run the following in the terminal:

```
npm test app.test.js
```

## Versions Used

| Technology | Version |
| ---------- | ------- |
| Node JS    | 19.1.0  |
| PostgreSQL | 8.7.3   |
| Express    | 4.18.2  |
| Jest       | 27.5.1  |
