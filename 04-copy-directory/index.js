const fs = require('fs');
const path = require('path');
const { mkdir } = require('node:fs/promises');
const { copyFile, readdir } = require('node:fs/promises');

const copyDir = async () => {
  const folderPath = path.resolve(__dirname, 'files');
  const folderCopyPath = path.resolve(__dirname, 'files-copy');

  console.log(folderPath);

  try {
    await mkdir(folderCopyPath, { recursive: true });
    const files = await readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        await copyFile(
          path.join(folderPath, file.name),
          path.join(folderCopyPath, file.name),
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
};
copyDir();
