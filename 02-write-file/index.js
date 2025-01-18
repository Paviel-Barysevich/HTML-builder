const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const pathToFile = path.join(path.dirname(__filename), 'output.txt');

stdout.write(
  "Hello! Enter some sentences, you'll find them in 02-write-file/output.txt\n",
);
fs.createWriteStream(pathToFile);
stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') exit();
  fs.appendFile(pathToFile, data, (error) => {
    if (error) console.log(error.message);
  });
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('Entering has been stopped.'));