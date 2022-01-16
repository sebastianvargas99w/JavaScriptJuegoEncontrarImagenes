const fs = require('fs');

function generateImageArray() {
  return fs.readdirSync('../images/');
}

function writeFile() {
  const logger = fs.createWriteStream('log.js', {
    flags: 'a',
  });
  const imageArray = generateImageArray();
  logger.write('const imageArray = [\n');
  for (let indexOfarray = 0; indexOfarray < imageArray.length; indexOfarray += 1) {
    if (indexOfarray === Number(imageArray.length) - 1) {
      logger.write(`  '${imageArray[indexOfarray]}'];`);
    } else {
      logger.write(`  '${imageArray[indexOfarray]}',\n`);
    }
  }
  logger.write('\n');
}

writeFile();
