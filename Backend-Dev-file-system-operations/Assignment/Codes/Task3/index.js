const fs = require("fs");
const path = require("path");

const sourceDir = "SDIR";
const destDir = "DDIR";

fs.readdir(sourceDir, (err, sourceFiles) => {
  if (err) {
    console.log("Error reading source directory:", err.message);
    return;
  }

  sourceFiles.forEach((file) => {
    const sourceFilePath = path.join(sourceDir, file);
    const destFilePath = path.join(destDir, file);

    if (!fs.existsSync(destFilePath)) {
      fs.copyFile(sourceFilePath, destFilePath, (err) => {
        if (err) {
          console.log(`Error copying ${file}:`, err.message);
        } else {
          console.log(`Copied ${file} from SDIR to DDIR`);
        }
      });
    } else {
      console.log(`File ${file} already exists in DDIR, skipping`);
    }
  });
});
