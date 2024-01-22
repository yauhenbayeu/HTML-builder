const fs = require('fs');
const path = require('path');
const {
  mkdir,
  readdir,
  writeFile,
  readFile,
  copyFile,
} = require('node:fs/promises');

const buildPage = async () => {
  const distDir = path.join(__dirname, 'project-dist');
  const templateHtml = path.join(__dirname, 'template.html');

  const stylesDir = path.join(__dirname, 'styles');
  let stylesData = '';

  //   console.log('templateHtml', templateHtml);

  try {
    await mkdir(distDir, { recursive: true });

    const assetsPath = path.resolve(__dirname, 'assets');
    const assetsDestPath = path.resolve(distDir, 'assets');
    await mkdir(assetsDestPath, { recursive: true });
    const assets = await readdir(assetsPath, { withFileTypes: true });

    const htmlStream = fs.createReadStream(templateHtml, 'utf-8');
    let htmlData = '';
    const stylesFiles = await readdir(stylesDir, { withFileTypes: true });

    const copyAssets = async (assets, folderName = '') => {
      for (const asset of assets) {
        if (asset.isFile()) {
          await mkdir(path.join(assetsDestPath, folderName), {
            recursive: true,
          });

          await copyFile(
            path.join(assetsPath, folderName, asset.name),
            path.join(assetsDestPath, folderName, asset.name),
          );
        } else {
          const pathToAsset = path.resolve(assetsPath, asset.name);
          const assets = await readdir(pathToAsset, { withFileTypes: true });
          copyAssets(assets, asset.name);
        }
      }
    };
    copyAssets(assets);

    await new Promise((resolve, reject) => {
      htmlStream.on('data', (chunk) => {
        htmlData += chunk;
      });
      htmlStream.on('end', () => resolve());
      htmlStream.on('error', (err) => reject(err));
    });

    const replaceHtml = (row, tagName, tplData) => {
      const regex = new RegExp(`{{${tagName}}}`, 'g');
      return row.replace(regex, tplData);
    };

    const matches = htmlData.match(/\{\{([^}]+)\}\}/g);
    if (matches) {
      for (const tag of matches) {
        const tagName = tag
          .split('')
          .slice(2, tag.length - 2)
          .join('');
        // console.log(tagName);

        const tpl = path.resolve(__dirname, 'components', `${tagName}.html`);

        const tplData = await readFile(tpl, 'utf-8');
        htmlData = replaceHtml(htmlData, tagName, tplData);
      }
    }
    // console.log('htmlData', htmlData);

    for (const file of stylesFiles) {
      if (file.isFile()) {
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
          });
        }
      }
    }

    await writeFile(path.join(distDir, 'index.html'), htmlData);
    await writeFile(path.join(distDir, 'style.css'), stylesData);
  } catch (err) {
    console.error(err);
  }
};
buildPage();
