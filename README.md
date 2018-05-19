# My Cupboard 

> Web Technologies COMS32500 \
> University of Bristol

> [Unit Webpage](https://csijh.gitlab.io/COMSM0104/)

## Authors

[@ahmerb](https://www.github.com/ahmerb) - Ahmer Butt \
[@lun3x](https://www.github.com/lun3x) - Louis Wyborn

## Setup & Usage

#### Database

Install mysql using brew and setup a user `root` and password `pass`. If installed with brew, you
might need to run

```bash
$ brew services start mysql
```

Now, login with

```bash
$ mysql -u root -ppass
```

Create a new database `mydb2`.

```sql
mysql> create database mydb2;
mysql> \q
```

Run all migrations.

```bash
$ npx db-migrate up -v
```

Now, seed the database with the following. If prompted for password, enter `pass`.

```bash
mysql -u root -p mydb2 < seed.sql
```

#### Redis

We use redis for session storage. Install redis with Homebrew.

#### Run the application using Heroku (reccomended)

Make sure Herkou-cli is installed. This can be done easily on mac using brew

```bash
$ brew install heroku
```

To launch mysql server:

```bash
$ mysql.server start
```

To launch the server, execute

```bash
$ npm install
$ heroku local
```

To compile and bundle frontend in development mode instead:

```bash
$ cd frontend && npm install && npm run devbuild && cd ..
```

Then, navigate to `https://localhost:PORT` in the browser, where `PORT` is the port given in the console output. Or, see redirection in action, navigate to `http://localhost:8080`.

#### Run the application using Node

To launch mysql server:

```bash
$ mysql.server start
```

To launch redis (for session storage)

```bash
$ redis-server /usr/local/etc/redis.conf
```

To run the server:

```bash
$ npm install && npm start
```

To compile and bundle frontend in development mode instead:

```bash
$ cd frontend && npm install && npm run devbuild && cd ..
```

## API

Html is delivered as `application/xhtml+xml` or `text/html` by setting the `Content-Type` header, depending on what the client browser includes in the request `Accepts` header.

Xhr resources are delivered as `application/json`.

#### HTTP Verbs and Statuses

We use the following conventions.

##### HTTP Verbs

GET - Get home page or read resource.

PUT - Update/replace/modify a resource.

POST - Create a new resource.

DELETE - Delete a resource.

##### HTTP Statuses

200 - On successful GET or PUT, including when there is no content.

201 - On successful POST.

401 - Trying to access resource when not logged in.

403 - User accessing resource they do not have permissions for.

404 - Resource not found.

409 - Conflict on POST (e.g. resource already exists).

422 - Semantic/syntactic failure trying to process request parameters or body.

## For Developers

#### Database

To add a new migration, cd into site and run:

```bash
npx db-migrate create addSomethingNew
```

The documentation for db-migrate is found [here](https://db-migrate.readthedocs.io/en/latest/).


## Deployment

Deployment with Heroku.

Redis-heroku setup on free tier.
JawsDb for heroku set up on free tier (mysql).

In Procfile, release command is run after any release/build/change config vars etc.
It runs database migrations.
It also triggeres npm run postinstall, which is setup to cd into

In Procfile, web command is run to start server etc. 

To seed the production db with initial ingredients, the following command was used:

```bash
$ mysql -h HOST -u USER -pPASS DB < seed.sql
```

Create new seed files, do a release to run migrations, then run the new seed file, to add
more seeds to the db.

See database.json for connection details for prod database.
