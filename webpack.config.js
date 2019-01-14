const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default
const { execSync } = require('child_process')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CustomTaskWatcherPlugin = function(options) {
	this.startTime = Date.now()
	this.prevTimestamps = {}
}

CustomTaskWatcherPlugin.prototype.apply = function(compiler) {
	compiler.hooks.emit.tapAsync(
		'CustomTaskWatcherPlugin',
		function(compilation, callback) {
			// Get a list of changed files
			const changedFiles = new Map()
			for (const [filepath, date] of compilation.fileTimestamps) {
				if (
					(this.prevTimestamps.get(filepath) || this.startTime) <
					(date || Infinity)
				) {
					changedFiles.set(filepath, date)
				}
			}

			this.prevTimestamps = compilation.fileTimestamps

			const customTasks = {
				'/templates/': () => {
					// console.log('executing templates command')
					let stdout = execSync('node ./scripts/build-templates.js')
				},
				'/images/': () => {
					// console.log('executing images command')
					let stdout = execSync(
						`node -e "require('./scripts/copy-images.js')(['src/images'])"`
					)
				},
				'/files/': () => {
					// console.log('executing files command')
					let stdout = execSync(
						`node -e "require('./scripts/copy-files.js')(['src/files'])"`
					)
				}
			}

			// console.log('Testing changed files...', changedFiles)

			// Check to see if any of the changed files fit the criteria for
			// custom tasks
			for (const [filepath, date] of changedFiles) {
				for (const path in customTasks) {
					console.log('filepath, path', filepath, path)
					if (filepath.indexOf(path) !== -1) {
						customTasks[path]()
					}
				}
			}
			callback()
		}.bind(this)
	)
}

module.exports = {
	entry: './src/scripts/index.js',
	devServer: {
		contentBase: './dist',
		watchContentBase: true
	},
	output: {
		path: __dirname + '/dist/scripts/',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.scss$/,
				use: [
					// fallback to style-loader in development
					process.env.NODE_ENV !== 'production'
						? { loader: 'style-loader', options: { singleton: true } }
						: MiniCssExtractPlugin.loader,
					{
						// translates CSS into CommonJS
						loader: 'css-loader',
						options: { sourceMap: true }
					},
					{
						// compiles Sass to CSS, using Node Sass by default
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			}
		]
	},
	plugins: [
		new CustomTaskWatcherPlugin(),
		new WatchExternalFilesPlugin({
			files: [
				'./src/templates/**/*.{pug,md}',
				'./src/images/**/*',
				'./src/files/**/*'
			],
			verbose: true
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].css',
			chunkFilename: '[id].css'
		})
	]
}
