# outfit-dashboard

## About

App build with React(Vite) / NestJS - both with Typescript. Bundled with [Turbo](https://turbo.build).

MongoDB Atlas (with mongoose) was used as database. Connection string is stored .env file. .env file pushed to github for convinience reasons.

Shadcn was used as frontend component library, Tailwind for styling.

## Installation

Run command in root folder.

```bash
$ npm i
```

## Running the app

Run command in root folder:

```bash
$ npm run dev
```

You can also individually run backend/frontend servers.

### Backend

Move into direcory

```bash
$ cd apps/dashboard-backend
```

Start dev server

```bash
$ npm run start
```

OR start in watch mode

```bash
$ npm run start:dev
```

### Frontend

Move into direcory

```bash
$ cd apps/dashboard-frontend
```

Start dev server

```bash
$ npm run dev
```

## Test

Run backend/frontend tests

```bash
$ npm run test
```

You can also run backend/frontend tests individually.

### Backend

Move into direcory

```bash
$ cd apps/dashboard-backend
```

Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Frontend

Move into direcory

```bash
$ cd apps/dashboard-backend
```

Run tests

```bash
# test
$ npm run test

# test coverage
$ npm run test:cov
```
