import fs from "fs";

const logFile = "response-time.log";

function responseTimeLogger(req, res, next) {
    const start = process.hrtime();

    res.on("finish", () => {
        const [sec, nano] = process.hrtime(start);
        const timeMs = (sec * 1000 + nano / 1e6).toFixed(2);

        const logEntry =
            `${new Date().toISOString()} | ` +
            `method used: ${req.method}| ` +
            `statusCode: ${res.statusCode} | response time: ${timeMs} ms\n`;

        fs.appendFile(logFile, logEntry, (err) => {
            if (err) {
                console.error("Error writing response time log:", err);
            }
        });
    });

    next();
}

export default responseTimeLogger