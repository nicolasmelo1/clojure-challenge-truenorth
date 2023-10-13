# TrueNorth Coding Challenge LoanPro (Backend)

Author: Nicolas Leal

## Description of the challenge

Implement a Web platform to provide a simple calculator functionality (addition, subtraction, multiplication,
division, square root, and a random string generation) where each functionality will have a separate cost per
request.

User’s will have a starting credit/balance. Each request will be deducted from the user’s balance. If the
user’s balance isn’t enough to cover the request cost, the request shall be denied.

This Web application and its UI application should be live (on any platform of your choice). They should be
ready to be configured and used locally for any other developer (having all instructions written for this
purpose).

## Solution

**LIVE DEMO**: (Live Demo Link)[https://truenorth-challenge-be2.fly.dev] (Notice that it might take a while for the server to spin up since i'm using a shared instance)

This project is the backend for the calculator. It is a REST API (ONLY) that provides the calculator functionality as well as the user management tooling.

#### Technologies used

- [Biff](https://biffweb.com/)
- [Malli](https://github.com/metosin/malli)
- [HoneySql](https://github.com/seancorfield/honeysql)
- [Babashka](https://github.com/babashka/babashka#installation)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Fly.io](https://fly.io/)

#### How to run the project in your local machine

1. Guarantee that you have Docker, Docker Compose, Java 11 or higher and [Babashka](https://github.com/babashka/babashka#installation) installed in your machine.
2. Clone this repository.

```shell
$ git clone https://github.com/nicolasmelo1/challenge-truenorth-loanpro-backend
```

3. Go to the project folder.

```shell
$ cd challenge-truenorth-loanpro-backend
```

4. Initialize the databases

```shell
$ docker compose up
```

5. Apply the migrations

```shell
$ bb run migrate
```

6. Run the project

```shell
$ bb run dev
```

**The tests spin up once you run the server, you should see a `Ran 18 tests containing 45 assertions.` on your terminal or you can programatically start it. Integration tests that tests more of the business logic are defined on `core/test.clj`**

#### How to run the project in Fly.io or any other platform

Just run the project using the Dockerfile provided in the root of the project.

#### How is the project structure and my though process

First, it's important to say: It was my first time using Clojure. I learned it for this project only.

The first thing i started looking into was backend frameworks. I got into a couple of them, the two that i got to decide was between [Kit](https://kit-clj.github.io/) and [Biff](https://biffweb.com/).
The reason i decided to go with Biff was because i thought it's documentation was better written and for a newbie like me, i found it easier to understand. Another thing that i liked about Biff is it's support for Domain Driven Design. This is ALWAYS my prefered way of structuring my projects instead of the traditional MVC.

By default biff uses [babashka](https://github.com/babashka/babashka) as it runner. I really enjoyed it but i had some trouble using certain libs like [Migratus](https://github.com/yogthos/migratus) in it. Because of that, i decided to create a simple migration tool. It woks pretty much the same as migratus. It was really fun doing it because i got to learn a lot about Clojure, how can i create a function, how can i interact with Java and etc.

**But why you choose Biff if Kit already solves this?** That'll be responded next.

##### Why i chose Biff and how the project is structured.

So let me explain what i mean by that: Biff, by default uses Plugins. Plugins are like **small** applications that should map to a specific domain of your application. A domain IS NOT a model. A domain is more like the business rule of the application. For example, in this project i have created 3 domains: `auth` (handles authentication), `operations` (handles operations), `records` (handles everything about showing the records or managing those records).

Each domain has it's own routes, controllers, services, repository and schemas. Let's say this application grew to a certain size, people started working on this project and the team is growing. Now i'll probably want to divide this huge project in smaller pieces, those smaller pieces are what we call microsservices. With that structure, this is completely possible because things are not coupled together. I can just take the `auth` domain and put it in a different project and it will work just fine.

Okay, so something i did not explain: _What is `core`?_

This is a special domain, it holds functionality for the hole application. Default middlewares, simple routes without any domain logic like `healthcheck` and etc. So, like i said before to extract a domain from this project i would need to check if my domain is using something from the `core`.

##### About `services` on each domain.

Every, EVERY business logic is defined on either `services.clj` or a `services` folder. We don't define business logic in routes, that would be an anti-pattern.

##### About the `repository` on each domain

This is where we put our queries, all DB queries are defined here. They are prefixed by `<table-name>-<name-of-operation>` and they are defined using [HoneySQL](https://github.com/seancorfield/honeysql). So let's say i want to fetch the users by id. Your function should be named: `users-by-id`.

Important: Queries are not shared between domains, that would couple the code together, we want DECOUPLED code. A Decoupled code makes everything easier to maintain, because if you change something in one query you don't need to worry about breaking something in another domain. It's really easy to maintain an application like that.

##### About the calculator

This was fun to do. For the calculator part i created an interpreter. A simple one. Just to calculate an expression. [That's NOT new for me](https://github.com/nicolasmelo1/teaut/tree/main/packages/shared/flow). I wanted to stick to the rules of the test so for the hole expression i pretty much debit for each operation of the user-balance and do a bulk insert operation to insert all of them after the operation is finished. Really nice. This means that the user is free to create an expression like "1+1" / "2\*2+(4\*5)". Something i DID NOT like about this and i would improve: The **|/**(square root) operator is not a unary operator, it's a Factor (What?) This means an expression like |/(5\*5) won't work :/. I would improve this by transforming the |/ in an unary operator. Unary is like the "-5" value. It's a 5 factor but the "-" up front.

##### About the records

This was also fun to do, i don't know if i understood the idea right or not, but i pretty much implemented. I created a simple endpoint that enables you to filter the way you want, this means you can filter by value with all sorts of filtering. You can filter values between two values, you can filter by "not in", you can filter by greater than, less than, or, of course, equal to a value.

The sorting was pretty straight forward to do.

Validation: This was the hardest part to do. I needed to guarantee that the data is properly validated before actually going to the handler, this way i can guarantee that the data goes correctly to the service. I did this by creating a middleware that validates query params, we validate them together with a Malli schema. This way we can guarantee that the data is validated correctly.

The problem with query params is that they should be flat like:

Instead of doing something like:

```json
{
  "filter": {
    "value": {
      "between": [1, 2]
    }
  }
}
```

We should do something like:

```json
{
  "filter-values": [1, 2],
  "filter-fields": ["id", "operation-id"]
}
```

Filter `values` and `fields` are related together, how can we validate that you send the correct query param? That's where my middleware comes in. We relate them together and validate if each one of them exist. You specify which query params are related together and it handles the rest.

##### Misc

1. I am using Malli for schema validation. It's really straight forward.
2. I decided to use HoneySQL over raw sql. I really like the idea of having a DSL to create my queries. you don't need to wrap your head around multiple languages while reading code and they work nicely with the language you are working with. I liked using it.

## What i would improve

A few things:

- Add redis for access and refresh tokens invalidation.
- Adding [typedclojure](https://github.com/typedclojure/typedclojure). I like strict typing system now. I was a fan of dynamic typing but as i started working with typed languages i started enjoying stuff typed.
- Disabling some Biff related stuff that i didn't use like XTDB.
- Better testing of everything. I would like to do pretty much integration tests, but i found it hard to do in clojure.

## API Documentation

All apis SHOULD be prefixed with `v1`, it guarantees that it will be versionated.

### core

- **_GET_** `/v1/healthcheck` - Healthcheck to check if the application is up and running.

### auth

- **_POST_** `/v1/auth/login` - Logs the user into the application. Will return both the refresh-token and the token. Should follow the following schema:

```json
{
  "username": "string",
  "password": "string"
}
```

- **_POST_** `/v1/auth/create-user` - Registers the user into the application. Should follow the following schema:

```json
{
  "username": "string",
  "password": "string"
}
```

- **_GET_** `/v1/auth/me` _(authenticated)_ - Returns the logged user information.

- **_GET_** `/v1/auth/refresh-token` _(authenticated)_ **WITH REFRESH TOKEN** - Returns a new token and refresh token for the user.

### operations

- **_GET_** `/v1/operations` _(authenticated)_ - Returns all operations in the database. It's not used for the frontend now, but it can be used to display the options that the user can select.

- **_POST_** `/v1/operations/new` _(authenticated)_ - Creates a new operation. Should follow the following schema:

```json
{
  "expression": "string" | null,
  "type": "expression" | "random-string"
}
```

### records

- **_GET_** `/v1/records` _(authenticated)_ - Returns all records in the database. It's used for the frontend to display the records. It has the following query params:

**IMPORTANT**: All query params are optional. If you specify each of the `filter` prefixed query params, you should specify the other two, otherwise it won't work. If you specify each of the `sorting` prefixed query params, you should specify the other one, otherwise it won't work.

```json
{
  "filter-values[]": ["string"],
  "filter-operations[]": ["equal" | "between" | "not-equal" | "greater-than" | "less-than"],
  "filter-fields[]": ["id" | "operation-type" | "amount" | "user-balance" | "operation-response" | "date"],
  "sorting-fields[]": ["id" | "operation-type" | "amount" | "user-balance" | "operation-response" | "date"],
  "sorting-orders[]": ["asc" | "desc"],
  "page": "number",
  "search": "string"
}
```

- **_DELETE_** `/v1/records/:id` _(authenticated)_ - Deletes a specific record by id.
