const fs = require('fs');
const path = require('path');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToStylesDir = path.join(__dirname, 'styles');
const pathToAssetsDir = path.join(__dirname, 'assets');
const pathToComponentsDir = path.join(__dirname, 'components');
const options = { withFileTypes: true };
const pathToProject = path.join(__dirname, 'project-dist');
const pathToCopyAssets = path.join(pathToProject, 'assets');
const pathToIndexHTML = path.join(pathToProject, 'index.html');
const pathToBundle = path.join(pathToProject, 'style.css');

const createFolder = (path) => {
  fs.mkdir(path, (error) => {
    if (error) console.log(error.message);
  });
};

const clearFolder = (pathToDir) => {
  fs.access(pathToDir, fs.constants.F_OK, (error) => {
    if (error) {
      createFolder(pathToDir);
    } else {
      fs.readdir(pathToDir, options, (error, files) => {
        if (error) console.log(error.message);

        for (const item of files) {
          const pathToItem = path.join(pathToDir, item.name);

          if (item.isDirectory()) {
            clearFolder(pathToItem);
          } else {
            fs.unlink(pathToItem, () => {});
          }
        }
      });
    }
  });

  createBundleWithStyles(copyDerictory);
};

const replaceMasksInTemplate = () => {
  const componentObject = {};
  let indexContent;

  fs.readFile(pathToTemplate, 'utf-8', (error, templateContent) => {
    if (error) {
      console.log(error.message);
    } else {
      indexContent = templateContent;
    }
  });

  fs.readdir(pathToComponentsDir, options, (error, files) => {
    if (error) console.log(error.message);

    for (const file of files) {
      const pathToFile = path.join(pathToComponentsDir, file.name);
      const extension = path.extname(pathToFile);

      if (file.isFile && extension === '.html') {
        const fileName = file.name;
        const key = '{{' + fileName.replace(extension, '') + '}}';

        fs.readFile(pathToFile, 'utf-8', (error, fileContent) => {
          if (error) {
            console.log(error.message);
          } else {
            componentObject[key] = fileContent;

            indexContent = indexContent.toString().replace(key, fileContent);

            fs.writeFile(pathToIndexHTML, indexContent, (error) => {
              if (error) console.log(error.message);
            });
          }
        });
      }
    }
  });
};

const createBundleWithStyles = (nextFunction) => {
  fs.readdir(pathToStylesDir, options, (error, files) => {
    nextFunction(pathToAssetsDir, pathToCopyAssets);

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
  });
};

const copyDerictory = (srcDir, destDir) => {
  fs.access(destDir, fs.constants.F_OK, (error) => {
    if (error) {
      createFolder(destDir);
    }
  });

  fs.readdir(srcDir, options, (error, list) => {
    if (error) console.log(error);

    for (const item of list) {
      if (error) console.log(error);

      const pathToItem = path.join(srcDir, item.name);
      const pathToCopyItem = path.join(destDir, item.name);

      if (item.isDirectory()) {
        copyDerictory(pathToItem, pathToCopyItem);
      } else {
        fs.copyFile(pathToItem, pathToCopyItem, (error) => {
          if (error) console.log(error);
        });
      }
    }
  });
};

const createProject = clearFolder;

createProject(pathToProject);
replaceMasksInTemplate();
copyDerictory(pathToAssetsDir, pathToCopyAssets);