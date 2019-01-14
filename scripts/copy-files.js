const fs = require('node-fs-extra')
const path = require('path')

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source =>
	fs
		.readdirSync(source)
		.map(name => path.join(source, name))
		.filter(isDirectory)

const filesSource = 'src/files'
const filesDirectories = [filesSource].concat(getDirectories(filesSource))

function copyFiles(paths = filesDirectories) {
	console.log('COPY FILES!', paths)
	paths.forEach(path => {
		const outputPath = path.replace(filesSource, 'dist/files')

		// Make sure the output path doesn't exist
		fs.copySync(path, outputPath, {
			overwrite: true,
			errorOnExist: false
		})
	})
}

module.exports = copyFiles
