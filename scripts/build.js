const { execSync } = require('child_process')
const copyImages = require('./copy-images')
const copyFiles = require('./copy-files')

let stdout = execSync('node ./scripts/build-templates.js')

copyImages()
copyFiles()
