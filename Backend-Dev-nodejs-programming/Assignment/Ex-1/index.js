const fs = require("fs");

fs.readFile("example.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("Error Reading file");
    return;
  }
  const words = data.trim().split(/\s+/);
  fs.appendFile("count.txt", `Word Count: ${words.length}`, (err) => {
    if (err) {
      console.log("Error Writing file");
      return;
    }
    console.log("Success");
  });
});
