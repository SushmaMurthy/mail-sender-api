#!/bin/bash
set -e

echo 'linting'
./node_modules/.bin/eslint src/*

echo 'unit testing'
./node_modules/.bin/istanbul cover node_modules/mocha/bin/_mocha "test/**/*.unit.test.js"
./node_modules/.bin/istanbul check-coverage

# integration test scripts to be done