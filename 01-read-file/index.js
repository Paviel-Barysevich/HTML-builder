const { stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const pathName = path.join(path.dirname(__filename), 'text.txt');
const readableStream = fs.createReadStream(pathName, 'utf-8');
let body = '';

readableStream.on('data', (chunk) => {
  body += chunk;
  stdout.write(body);
});
readableStream.on('end', () => exit());
readableStream.on('error', (error) => stdout.write(error.message));