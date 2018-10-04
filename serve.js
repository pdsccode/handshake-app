const express = require('express');
const compression = require('compression');
// const fallback = require('express-history-api-fallback');

const app = express();

const root = `${__dirname}/dist`;
app.use(express.static(root));
// app.use(fallback('index.html', { root }));
app.use(compression());
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server is listening on port ${port}`));
