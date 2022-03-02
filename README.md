# Resourcely
[![Continuous Integration](https://github.com/mukeshgurpude/resourcely-backend/actions/workflows/test.yml/badge.svg)](https://github.com/mukeshgurpude/resourcely-backend/actions/workflows/test.yml)

API for sharing media or data on the internet.

---

## Project Structure
* `src`: Source code
* `tests`: Root for tests
* `types`: Source for types
* `src/routes`: Routes for different type of resources
* `src/utils`: Utility functions

---

## Running locally
* Make sure you've [nodejs](https://nodejs.org) and [npm](https://www.npmjs.com) installed.
* Installed dependencies
  ```shell
  npm install
  ```
* Start development server
  ```shell
  npm run dev
  ```

---

## npm scripts
* `npm run build`: Compiles the typescript files
* `npm run dev`: Starts development server in watch mode
* `npm run lint`: Lints the source files with eslint
* `npm run lint:fix`: Lints the source files, and automatically fixes the fixable issues
* `npm start`: Start the server with compiled files
* `npm test`: Runs the test suite
* `npm run test:coverage`: Runs the test suite and generates a coverage report
* `npm run test:watch`: Starts the test suite in watch mode
* `npx cleanup`: Cleans up uploads folder (Delete expired files)
