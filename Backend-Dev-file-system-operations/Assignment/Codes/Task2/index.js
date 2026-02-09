const { log } = require("console");
const fs = require("fs");
const readline = require("readline");

const fileName = process.argv[2];

if (!fileName) {
  console.log("Please provide a file name");
  return;
}

const readStream = fs.createReadStream(fileName, "utf-8");

const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});
let totalLines = 0;
let errorCount = 0;
let warnCount = 0;

rl.on("line", (line) => {
  console.log("Line: ", line);
  totalLines++;
  if (line.includes("Error")) {
    errorCount++;
  }
  if (line.includes("Warn")) {
    warnCount++;
  }
});

rl.on("close", () => {
  console.log("Finished reading file");
  console.log(`Stats:\n 
    \t Total Lines: ${totalLines} \n
    \t Total Error: ${errorCount} \n
    \t Total Warn: ${warnCount} \n
    `);
});

readStream.on("error", (err) => {
  console.log("Error reading file", err.message);
});
