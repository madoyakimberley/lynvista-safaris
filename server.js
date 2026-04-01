const { createServer } = require("http");
const { parse } = require("url"); // Add this
const next = require("next");

const dev = false; // Hardcode to false for Namecheap
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    // Add the parsedUrl here
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Server running on port ${PORT}`);
  });
});
