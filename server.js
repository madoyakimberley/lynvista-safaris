import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = false;
const port = process.env.PORT || 3000;

const app = next({ dev, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on port ${port}`);
  });
});
