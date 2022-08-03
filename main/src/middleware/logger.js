import * as fs from "fs";
import * as os from "os";

export const logger = (req, res, next) => {
  const { url, method } = req;

  const data = {
    date: new Date().toISOString(),
    method: method,
    url: url,
  };

  fs.appendFile("logs/server.log", JSON.stringify(data) + os.EOL, (err) => {
    if (err) throw err;
  });

  next();
};
