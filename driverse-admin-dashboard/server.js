const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { connectToDb } = require('./src/app/lib/db.js');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  try {
    // First, connect to the database
    await connectToDb();
    console.log('✅ Database connected successfully');

    // Then start the server
    createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      } catch (err) {
        console.error(' Error handling request:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    })
      .once('error', (err) => {
        console.error('❌ Server error:', err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`🚀 Server ready on http://${hostname}:${port}`);
      });

  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
    process.exit(1); // Exit if DB connection fails
  }
});
