
## Description
This codebase uses `modules` and `shared` approaches to distinguish the responsibility for domain logic and utilities. In addition, entity is separated independently with each other. However, for this case, only single entity is used.

Clone the repository using this command (ensure Git is already installed on your machine)
```bash
$ git clone https://github.com/satrio-pamungkas/yellow-apple-and-blue-banana
```
Afterwards, ensure `Docker` and `docker compose` are installed on your machine

## Running the System with Entire Steps
Run this docker compose command to run both services (PostgreSQL and API)
```bash
$ docker compose up -d
```

In this docker compose, there will be three steps executed in the single command above
### 1. Running the migration
It's represented with this command in the compose
```bash
npm run migration:run 
```

### 2. Running the tests
It's represented with these commands
```bash
npm run test (for unit test)
npm run test:e2e (for e2e test)
```

### 3. Running the API backend in production mode
It's represented with this command
```bash
npm run start:prod
```

Upon both services are succesfully created and running, please access `localhost:3000/docs` on your browser to see available APIs with corresponding example and request format. This will redirect to `swagger OpenAPI` web page.