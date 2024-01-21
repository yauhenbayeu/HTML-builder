const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, 'output.txt'), '', (err) => {
  if (err) throw err;
});

process.on('exit', () => stdout.write('Have a nice day!'));

stdout.write('Write below smth:\n');

stdin.on('data', (data) => {
  const textData = data.toString();
  if (textData.trim() === 'exit') {
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'output.txt'), textData, (err) => {
      if (err) throw err;
    });
  }
});

process.on('SIGINT', () => {
  process.exit();
});
