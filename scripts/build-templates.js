const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const rmdir = require('rmdir-sync')
const glob = Promise.promisify(require('glob'))
const yamlFront = require('yaml-front-matter')
const marked = require('marked')
const highlightjs = require('highlight.js')
const Renderer = require('marked').Renderer
const pug = require('pug')
const moment = require('moment')
const { format } = require('date-fns')
const slugify = require('slugify')

const renderer = new Renderer()
renderer.code = (code, language) => {
	// Check whether the given language is valid for highlight.js.
	const validLang = !!(language && highlightjs.getLanguage(language))
	// Highlight only if the language is valid.
	const highlighted = validLang
		? highlightjs.highlight(language, code).value
		: code
	// Render the highlighted code with `hljs` class.
	return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
}

marked.setOptions({ renderer, smartypants: true })
// marked.setOptions({
// 	// Highlight code blocks
// 	highlight: function(code) {
// 		return require('highlight.js').highlightAuto(code).value
// 	}
// })

// Blow away the existing build
// rmdir('./dist/')

// Build index templates
function buildIndexes(posts) {
	// console.log('posts', posts);
	glob(
		'src/templates/**/*.pug',
		{
			nodir: true,
			ignore: ['src/templates/_**/*', 'src/templates/_*']
		},
		(err, files) => {
			// console.log('files', files);
			files.forEach((filename, i) => {
				let filepath = path.parse(filename.replace('src/templates/', ''))

				// console.log('filepath.dir', filepath.dir);
				if (filepath.dir) {
					mkdirp.sync(`dist/${filepath.dir}`)
				}

				let yaml = yamlFront.loadFront(filename)
				let compilePug = pug.compile(yaml.__content, {
					filename
				})

				fs.writeFileSync(
					`dist/${filepath.dir}/${filepath.name}`,
					compilePug({
						...yaml,
						utilities: {
							slugify,
							format
						},
						title: yaml.title,
						posts,
						tags: getTags(posts),
						env: process.env.NODE_ENV
					}),
					{
						encoding: 'utf-8'
					}
				)
			})
			// console.log('files', files);
		}
	)

	return posts
}

function getPosts() {
	function parseFiles(filenames) {
		let posts = filenames.map(file => {
			// Get date and filename
			let match = path.parse(file).name.match(/^(\d{4}-\d{2}-\d{2})-(.*)$/)

			const date = new Date(match[1] + ' 00:00:00 EST')
			const filename = match[2]

			// Get YAML data
			file = yamlFront.loadFront(file)

			file.date = date
			file.filename = filename
			file.url = `/${format(date, 'YYYY/MM/DD')}/${filename}/`

			// Turn Markdown into HTML
			file.__content = marked(file.__content)

			return file
		})

		return posts.filter(post => !post.draft)
	}

	return glob('src/templates/_posts/**/*.md').then(parseFiles)
}

function getTags(posts) {
	const tags = {}
	posts.forEach(post => {
		if (post.tags) {
			if (typeof post.tags === 'string') {
				post.tags = [post.tags]
			}

			post.tags.forEach(tag => {
				if (!tags[tag]) {
					tags[tag] = []
				}
				tags[tag].push(post)
			})
		}
	})
	return tags
}

function buildTagIndexes(posts) {
	const tags = getTags(posts)
	const pugCompiler = pug.compileFile(`src/templates/_tag.pug`)

	for (const tag in tags) {
		const dir = `./dist/tags/${tag}`
		mkdirp.sync(dir)
		fs.writeFileSync(
			dir + '/index.html',
			pugCompiler({
				format,
				tag,
				posts: tags[tag].map(normalizePost),
				env: process.env.NODE_ENV
			}),
			{ encoding: 'utf-8' }
		)
	}
}

function normalizePost(post) {
	return {
		title: post.title,
		summary: post.summary,
		content: post.__content,
		url: post.url,
		date: post.date,
		tags: post.tags,
		heroImage: post.heroImage
	}
}

function buildPosts(posts) {
	posts.forEach((post, i) => {
		const month = format(post.date, 'MM')
		const day = format(post.date, 'DD')

		// Build directories
		let dir = `./dist/${post.date.getFullYear()}/${month}/${day}/${
			post.filename
		}`
		let pugCompiler = pug.compileFile(
			`src/templates/_layouts/${post.layout}.pug`
		)

		let previousPost = undefined
		if (i > 0) {
			previousPost = normalizePost(posts[i - 1])
		}

		let nextPost = undefined
		if (posts.length > i + 1) {
			nextPost = normalizePost(posts[i + 1])
		}

		mkdirp.sync(dir)
		fs.writeFileSync(
			dir + '/index.html',
			pugCompiler({
				utilities: {
					slugify,
					format
				},
				...normalizePost(post),
				previousPost,
				nextPost,
				env: process.env.NODE_ENV
			}),
			{ encoding: 'utf-8' }
		)
	})

	return posts
}

getPosts()
	.then(buildPosts)
	.then(buildIndexes)
	.then(buildTagIndexes)
