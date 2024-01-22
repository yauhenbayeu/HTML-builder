const fs = require('fs');
const path = require('path');
const { readdir, writeFile } = require('node:fs/promises');

const copyStyles = async () => {
  //   console.log(__dirname);
  const direction = path.join(__dirname, 'project-dist');
  const stylesDir = path.join(__dirname, 'styles');
  //   console.log(direction);
  let stylesData = '';

  try {
    const files = await readdir(stylesDir, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        // console.log(file);
        const fileExtension = path.extname(file.name).slice(1);
        if (fileExtension === 'css') {
          const input = fs.createReadStream(
            path.join(stylesDir, file.name),
            'utf-8',
          );
          await new Promise((resolve, reject) => {
            input.on('data', (chunk) => (stylesData += chunk));
            input.on('end', () => resolve());
            input.on('error', (err) => reject(err));
            // stream.pipe(output);
          });
        }
      }
    }

    // console.log('stylesData', stylesData);
    // stylesData.pipe(output);
    await writeFile(path.join(direction, 'bundle.css'), stylesData);
  } catch (err) {
    console.error(err);
  }
};
copyStyles();
