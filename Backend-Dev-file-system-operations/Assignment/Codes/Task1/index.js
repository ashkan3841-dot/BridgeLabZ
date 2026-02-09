const fs = require("fs");

const command = process.argv[2];
const fileName = process.argv[3];

if (command === "read") {
  if (!fileName) {
    console.log("Enter the file name");
    return;
  } else {
    fs.readFile(fileName, "utf-8", (err, data) => {
      if (err) {
        console.log("Error Occurred while reading the file", err.message);
        return;
      }
      console.log(data);
    });
  }
} else if (command === "list") {
  const dir = fileName || ".";
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log("Error reading directory: ", err.message);
      return;
    }
    files.forEach((file) => {
      console.log(file);
    });
  });
} else if (command === "write") {
  const content = process.argv[4];
  if (!fileName) {
    console.log("Enter the file name");
    return;
  } else {
    if (!content) {
      console.log("Content can't be empty");
    } else {
      fs.writeFile(fileName, content, (err) => {
        if (err) {
          console.log("Error writing in file", err.message);
          return;
        }
        console.log("Done writing in File", fileName);
      });
    }
  }
} else if (command === "copy") {
  const destination = process.argv[4];
  if (!fileName || !destination) {
    console.log("Enter the Source and Destination file correctly");
    return;
  } else {
    fs.copyFile(fileName, destination, (err) => {
      if (err) {
        console.log("Error copying the file", err.message);
        return;
      }
      console.log(`Done copying file: ${fileName} to file: ${destination}`);
    });
  }
} else if (command === "delete") {
  if (!fileName) {
    console.log("Please type which file to delete");
    return;
  } else {
    fs.unlink(fileName, (err) => {
      if (err) {
        console.log("Error Deleting the file ", err.message);
      }
      console.log("File Deleted Successfully");
    });
  }
} else {
  console.log("Unknown Command");
}
