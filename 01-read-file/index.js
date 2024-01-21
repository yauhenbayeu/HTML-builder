const fs = require('fs');
const path = require('path');

// console.log(path.dirname(__filename));

const fileDoc = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(fileDoc, 'utf-8');
let data = '';
stream.on('data', (chunk) => (data += chunk));
stream.on('end', () => console.log('End', data));
