const del = require('del')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const fs = require('fs')
const path = require('path')

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source =>
	fs
		.readdirSync(source)
		.map(name => path.join(source, name))
		.filter(isDirectory)

const imagesSource = 'src/images'
const imageDirectories = [imagesSource].concat(getDirectories(imagesSource))

function optimizeImages(paths = imageDirectories) {
	console.log('OPTIMIZE IMAGES!', paths)
	paths.forEach(async path => {
		const outputPath = path.replace(imagesSource, 'dist/images')

		// Make sure the output path doesn't exist
		del.sync(outputPath)

		const files = await imagemin(
			[`${path}${isDirectory(path) ? '/*{png,PNG,jpg,JPG}' : ''}`],
			outputPath,
			{
				plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })]
			}
		)
	})
}

module.exports = optimizeImages
