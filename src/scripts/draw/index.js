import { getLetters } from './letters.js'

const options = {
	letterWidth: 50,
	space: 10,
	stroke: 3,
	padding: 0
}

const elements = document.querySelectorAll('.draw')

elements.forEach(element => {
	const svg = createNS('svg')
	const text = element.textContent
	let word = text
		.replace(/\s/, '')
		.toUpperCase()
		.split('')

	const dimensions = element.getBoundingClientRect()
	console.log('element', element, 'dimensions', dimensions)
	console.log(
		'element.clientWidth, element.clientHeight',
		element.clientWidth,
		element.clientHeight
	)

	svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`)
	element.innerHTML = ''
	element.appendChild(svg)

	const bBox = svg.getBBox()
	const vBox = svg.viewBox.baseVal
	console.log(vBox)

	const grid = {
		height: vBox.height,
		width: vBox.width,
		top: options.stroke / 2,
		left: options.stroke / 2
	}

	grid.bottom = grid.height - options.stroke / 2 - options.padding * 2

	options.space = grid.width / 60
	options.letterWidth =
		(grid.width - options.padding * 2 - options.space * (word.length - 1)) /
		word.length

	const letters = getLetters(options, grid)

	word = word.map(letter => letters[letter.toUpperCase()])

	// @see https://stackoverflow.com/a/28734954/399077
	function createNS(element) {
		return document.createElementNS('http://www.w3.org/2000/svg', element)
	}

	let letterElements

	function drawLetters() {
		let left = options.padding
		letterElements = []
		word.forEach(letter => {
			const polyline = createNS('polyline')
			polyline.setAttribute('fill', 'none')
			polyline.setAttribute(
				'points',
				letter
					.map(point => {
						const adjusted = point.slice()
						adjusted[0] += left
						adjusted[1] += options.padding
						return adjusted.join(',')
					})
					.join(' ')
			)
			const length = getPolylineLength(polyline)

			if (sessionStorage.getItem('firstTime') !== 'false') {
				polyline.setAttribute('stroke-dasharray', length)
				polyline.setAttribute('stroke-dashoffset', length)

				sessionStorage.setItem('firstTime', false)
			} else {
				// Figure out a way to not draw things in
				polyline.setAttribute('stroke-dasharray', length)
				polyline.setAttribute('stroke-dashoffset', length)
			}

			letterElements.push(polyline)
			svg.appendChild(polyline)
			left += options.letterWidth + options.space
		})
	}

	drawLetters()

	function randomizeLetterAnimations() {
		letterElements.forEach(polyline => {
			var offset = Math.random() * 1000 + 'ms'
			polyline.style.animationDelay = offset
			// Randomize duration, too
			//polyline.style.animationDuration = Math.random() * 2000 + 'ms';
		})
	}

	function listenForDrawingEnd() {
		let i = letterElements.length
		letterElements.forEach(polyline => {
			polyline.addEventListener('animationend', event => {
				console.log(i + ' animation end')
				i -= 1
				if (i === 0) {
					element.classList.remove('draw-in')
					element.classList.add('drawn')

					i = letterElements.length
				}
			})
		})
	}

	function listenForTransitionEnd(callback) {
		let i = letterElements.length
		letterElements.forEach(polyline => {
			polyline.addEventListener('transitionend', event => {
				console.log(i + ' transition end')
				i -= 1
				if (i === 0) {
					console.log('TRANSITION END')
					callback()
					i = letterElements.length
				}
			})
		})
	}

	listenForDrawingEnd()
	//listenForTransitionEnd();
	randomizeLetterAnimations()

	// @see http://stackoverflow.com/a/34893908/399077
	function getPolylineLength(polylineElement) {
		function dis(p, q) {
			return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y))
		}
		var ps = polylineElement.points,
			n = ps.numberOfItems,
			len = 0
		for (var i = 1; i < n; i++) {
			len += dis(ps.getItem(i - 1), ps.getItem(i))
		}
		return len
	}
})
