const { stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const pathName = path.join(path.dirname(__filename), 'text.txt');

fs.readFile(pathName, 'utf-8', (error, data) => {
  if (error) {
    stdout.write(`An error happened: ${error.message}`);
    exit();
  }

  stdout.write(data);
});