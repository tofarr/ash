const { exec } = require('child_process');

const PUBLIC_URL = 'https://tofarr.github.io/ash/';

console.log('CREATING DISTRIBUTION')
console.log(`This should be pushed assumes the project will be hosted at: ${PUBLIC_URL}`)
console.log('This will refresh the contents of the /build and /docs directories...')
console.log(`This should be pushed to github where it will be served from ${PUBLIC_URL}`)

console.log('Rebuilding project...')
exec(`PUBLIC_URL=${PUBLIC_URL} npm run build`)
console.log('Clearing existing docs directory...')
exec('rm -rf /docs')
console.log('Copying build to docs')
exec('cp -r build/* docs/')
