const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Prevent unexpected process exits from unhandled rejections or background socket errors
process.on('unhandledRejection', (reason, promise) => {
  console.warn('GIGADROP: Unhandled Rejection intercepted (non-fatal):', reason);
});

process.on('uncaughtException', (err) => {
  console.error('GIGADROP: Uncaught Exception intercepted (non-fatal):', err);
});

const dev = false;
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal server error');
        }
      }
    });

    server.listen(port, () => {
      console.log(`> GIGADROP Server listening on port/socket: ${port}`);
    });

    server.on('error', (err) => {
      console.error('HTTP Server listener error:', err);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js server:', err);
    process.exit(1);
  });
