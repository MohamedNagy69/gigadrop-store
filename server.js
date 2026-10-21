const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }).listen(port, () => {
      console.log(`> GIGADROP Server listening on port/socket: ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js server:', err);
    process.exit(1);
  });
