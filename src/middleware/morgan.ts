import morgan, { StreamOptions } from "morgan";
import Logger from "../logger/logger";

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

morgan.token("status", function (req, res) {
    let color ;

    if (res.statusCode < 300) color = "\x1B[32m";    // Green
    else if (res.statusCode < 400) color = "\x1B[36m"; // Cyan
    else if (res.statusCode < 500) color = "\x1B[33m";   // Yellow
    else if (res.statusCode >= 500) color = "\x1B[31m";   // Red
    else color = "\x1B[0m"; // Reset to default

    return color + res.statusCode + "\x1B[35m"; // Purple
});

const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    { stream, skip }
);

export default morganMiddleware;

// // https://jeonghwan-kim.github.io/morgan-helper/
// morgan.token("request", function (req, res) {
//     return "Request_" + JSON.stringify(req);
// });
// morgan.token("makeLine", function () {
//     let line = "-----------------------------------------------*(੭*ˊᵕˋ)੭* 응답 결과 ╰(*'v'*)╯-----------------------------------------------"
//     let blank = "                                   ";
//     return line + "\n" + blank;
// });