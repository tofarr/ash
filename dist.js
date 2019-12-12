const { exec } = require('child_process');

console.log('CREATING DISTRIBUTION')
console.log('This will refresh the contents of the /docs directory...')
console.log('This should be pushed to github where it will be served from https://tofarr.github.io/ash/dist')

exec('rm -rf /docs', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
})


exec('cp -r build docs')
