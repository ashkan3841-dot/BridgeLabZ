# HTTP Status Master

Easy way to use HTTP status codes and messages in your projects.

## Installation
 npm i http-status-pro-js

## Usage

### Using CommonJS (require)
const { StatusCodes, getStatus } = require('http-status-pro-js');

### Using ES Modules (import)
import { StatusCodes } from 'http-status-pro-js';

console.log(StatusCodes.OK.code); // 200
console.log(StatusCodes.NOT_FOUND.message); // "Not Found"
console.log(getStatus(500)); // "Internal Server Error"