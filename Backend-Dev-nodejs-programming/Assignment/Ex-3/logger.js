const os = require("os");
const fs = require("fs");

setInterval(() => {
  const platform = os.platform();
  const cpu = os.cpus().length;
  const totalMem = `${(os.totalmem() / 1024 ** 3).toFixed(2)} "GB"`;
  const msg = `Platform: ${platform}  CPU: ${cpu} Total Memory: ${totalMem}\n`;
  fs.appendFile("info.log", msg, (err) => {
    if (err) {
      console.log("Error");
      return;
    }
    console.log("Done");
  });
}, 5000);
