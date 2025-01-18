const { stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const pathToDir = path.join(__dirname, 'secret-folder');
const option = { withFileTypes: true };

fs.readdir(pathToDir, option, (error, files) => {
  if (error) {
    stdout.write(error.message);
    exit();
  }

  for (let dirent of files) {
    if (dirent.isFile()) {
      let fileNameArray = dirent.name.split('.');
      const fileExtension = fileNameArray.pop();
      const fileName = fileNameArray.join('.');
      const pathToFile = path.join(pathToDir, dirent.name);

      fs.stat(pathToFile, (error, stats) => {
        if (error) {
          stdout.write(error.message);
          exit();
        }

        const fileSize = stats.size;

        stdout.write(`${fileName} - ${fileExtension} - ${fileSize}B\n`);
      });
    }
  }
});
