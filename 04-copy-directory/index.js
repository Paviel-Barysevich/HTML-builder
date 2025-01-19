const { stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'files');
const copyDirName = 'files-copy';
const pathToCopyFolder = path.join(__dirname, copyDirName);
const copyFiles = () => {
  fs.readdir(pathToFolder, (error, files) => {
    if (error) showErrorMessage(error);

    for (let fileName of files) {
      const src = path.join(pathToFolder, fileName);
      const dest = path.join(pathToCopyFolder, fileName);

      fs.copyFile(src, dest, (error) => showErrorMessage(error));
    }
  });
};

const removeFiles = () => {
  fs.readdir(pathToCopyFolder, (error, files) => {
    if (error) showErrorMessage(error);

    for (let fileName of files) {
      const pathToRemovingFile = path.join(pathToCopyFolder, fileName);

      fs.unlink(pathToRemovingFile, (error) => showErrorMessage(error));
    }
  });
};

fs.access(pathToCopyFolder, fs.constants.F_OK, (error) => {
  if (error) {
    fs.mkdir(pathToCopyFolder, (error) => showErrorMessage(error));
    copyFiles();
  } else {
    removeFiles();
    copyFiles();
  }
});

function showErrorMessage(error) {
  if (error) {
    stdout.write(error.message);
    exit();
  }
}
