# My Cupboard 

> Web Technologies COMS32500 \
> University of Bristol

> [Unit Webpage](https://csijh.gitlab.io/COMSM0104/)

## Authors

[@ahmerb](https://www.github.com/ahmerb) - Ahmer Butt \
[@lun3x](https://www.github.com/lun3x) - Louis Wyborn

## Setup & Usage

#### Database

Install mysql and setup a user `root` and password `pass`. Login with

```bash
$ cd site
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

TODO: Add a seed file

#### Run the application

To compile and bundle frontend:

```bash
$ cd site/frontend && npm run build
```

To run the server:

```bash
$ cd site && npm start
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
