const debug = require('debug');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const express = require('express');

const stat = promisify(fs.stat);

const info = debug('server*');
const log = debug('server');

const dist = path.join(__dirname, 'dist');

const isFile = async path => {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

const pathExists = async filePath => {
  log(`Trying path:`, filePath);

  try {
    return (await isFile(filePath)) ? filePath : null;
  } catch (error) {
    return null;
  }
}

// converts /posts/ -> /posts/index.html
const findDirectoryIndexPath = async urlPath => {
  const filePath = path.join(dist, `${urlPath}index.html`);
  return pathExists(filePath);
}

// converts /posts/ -> /posts.html
const pathToHtml = urlPath => urlPath.slice(-1) === '/' ? urlPath.slice(0, -1) : urlPath

const findIndexPath = async urlPath => {
  const filePath = `${path.join(dist, pathToHtml(urlPath))}.html`;
  return pathExists(filePath);
}

const findPath = async urlPath => {
  const filePath = path.join(dist, urlPath);
  return pathExists(filePath);
}

const app = express();

app.use(function (req, res, next) {
  info(`${req.method} ${req.path}`);
  next();
});

app.use(async function (req, res, next) {
  let filePath = await findPath(req.path);

  if (filePath) {
    return res.sendFile(filePath);
  }

  filePath = await findIndexPath(req.path);
  if (filePath) {
    return res.sendFile(filePath);
  }

  filePath = await findDirectoryIndexPath(req.path);
  if (filePath) {
    return res.sendFile(filePath);
  }

  next();
});

app.listen(8080, () => info(`Listening http://localhost:8080`));
