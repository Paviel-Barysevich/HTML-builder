const { exit } = process;
const fs = require('fs');
const path = require('path');
const pathToStylesDir = path.join(__dirname, 'styles');
const options = { withFileTypes: true };
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

const createBundleWithStyles = () =>
  fs.readdir(pathToStylesDir, options, (error, files) => {
    if (error) console.log(error.message);

    fs.createWriteStream(pathToBundle);

    let readableStream;

    for (const file of files) {
      const pathToFileWithStyles = path.join(pathToStylesDir, file.name);

      if (path.extname(pathToFileWithStyles) === '.css') {
        readableStream = fs.createReadStream(pathToFileWithStyles, 'utf-8');

        readableStream.on('data', (chunk) =>
          fs.appendFile(pathToBundle, chunk, (error) => {
            if (error) console.log(error.message);
          }),
        );
        readableStream.on('error', (error) => console.log(error));
      }
    }

    readableStream.on('end', () => exit());
  });

createBundleWithStyles();