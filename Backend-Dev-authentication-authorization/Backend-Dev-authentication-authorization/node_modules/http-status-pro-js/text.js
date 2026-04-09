const { StatusCodes, getStatus } = require('./index.js');

console.log("--- Testing HTTP Status Pro ---");
console.log("Code for OK:", StatusCodes.OK.code); // 200
console.log("Message for 404:", StatusCodes.NOT_FOUND.message); // Not Found
console.log("Search for 500:", getStatus(500)); // Internal Server Error