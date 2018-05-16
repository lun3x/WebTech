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


#### Run the application

To launch mysql server:

```bash
$ mysql.server start
```

To launch redis (for session storage)

```bash
$ /usr/local/etc/redis.conf
```

To run the server:

```bash
$ cd site && npm install && npm start
```

To compile and bundle frontend:

```bash
$ cd site/frontend && npm install && npm run build
```

## API

Html is delivered as `application/xhtml+xml`.

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