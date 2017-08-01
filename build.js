const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rmdir = require('rmdir-sync');
const glob = Promise.promisify(require('glob'));
const yamlFront = require('yaml-front-matter');
const marked = require('marked');
const pug = require('pug');
const moment = require('moment');

marked.setOptions({
	// Highlight code blocks
	highlight: function (code) {
		return require('highlight.js').highlightAuto(code).value;
	}
});

// Blow away the existing build
rmdir('./build/');

// Build index templates
function buildIndexes(posts) {
	// console.log('posts', posts);
	glob('src/templates/**/*', {
		nodir: true,
		ignore: [
			'src/templates/_**/*',
		]
	}, (err, files) => {
		files = [files[0]];
		console.log('files', files);
		files.forEach((filename, i) => {
			let filepath = path.parse(filename.replace('src/templates/', ''));

			if (filepath.dir) {
				mkdirp.sync(filepath.dir);
			}

			let yaml = yamlFront.loadFront(filename);
			// console.log('yaml', yaml);
			let compilePug = pug.compile(yaml.__content);
			
			console.log('filepath.dir, filepath.base', filepath.dir, filepath.base);
			fs.writeFileSync(`build/${filepath.dir}${filepath.base}`, compilePug({
				moment,
				title: yaml.title,
				posts
			}), {
				encoding: 'utf-8'
			});

		});
		// console.log('files', files);
	});
}

function getPosts() {
	function parseFiles(filenames) {
		let posts = filenames.map(file => {
			// Get date and filename
			let match = path.parse(file).name.match(/^(\d{4}-\d{2}-\d{2})-(.*)$/);

			const date = new Date(match[1] + ' 00:00:00 EST');
			const filename = match[2];

			// Get YAML data
			file = yamlFront.loadFront(file);

			file.date = date;
			file.filename = filename;

			// Turn Markdown into HTML
			file.__content = marked(file.__content);

			return file;
		});

		return posts;
	}

	return glob('src/templates/_posts/**/*.md').then(parseFiles);
}

function buildPosts(posts) {
	posts.forEach(post => {
		let month = post.date.getMonth() + 1;
		let day = String(post.date.getDate());

		// Lead with zeroes, if necessary
		month = month.length === 2 ? month : '0' + month;
		day = (day.length === 2) ? day : '0' + day;

		// Build directories
		let dir = `./build/${post.date.getFullYear()}/${month}/${day}/${post.filename}`;
		let pugCompiler = pug.compileFile(`src/templates/_layouts/${post.layout}.pug`);

		mkdirp.sync(dir);
		fs.writeFileSync(dir + '/index.html', pugCompiler({
			moment,
			title: post.title,
			summary: post.summary,
			content: post.__content,
			date: post.date
		}), { encoding: 'utf-8' });
	});

	return posts;
}

getPosts()
	.then(buildPosts)
	.then(buildIndexes);
