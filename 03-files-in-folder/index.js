const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

const folderPath = path.resolve(__dirname, 'secret-folder');
// console.log(folderPath);

const getFiles = async () => {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileExtension = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, path.extname(file.name));

        fs.stat(filePath, (err, fileInfo) => {
          if (err) {
            console.error(err);
            return;
          }

          const fileSize = (fileInfo.size / 1024).toFixed(3);
          console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
};
getFiles();
