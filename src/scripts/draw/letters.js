function getLetters(options, grid) {
	return {
		A: [
			[grid.left, grid.bottom],
			[options.letterWidth / 2, grid.top],
			[options.letterWidth, grid.bottom],
			[options.letterWidth / 2 / 2, grid.bottom / 2]
		],
		B: [
			[grid.left, grid.bottom],
			[grid.left, grid.top],
			[options.letterWidth, grid.top],
			[options.letterWidth, grid.bottom / 2.2],
			[grid.left, grid.bottom / 2],
			[options.letterWidth, grid.bottom / 1.8],
			[options.letterWidth, grid.bottom],
			[grid.left, grid.bottom]
		],
		C: [
			[options.letterWidth, grid.bottom / 10],
			[grid.left, grid.bottom / 10],
			[grid.left, grid.bottom / 1.1],
			[options.letterWidth, grid.bottom]
		],
		E: [
			[grid.left, grid.top],
			[grid.left, grid.bottom],
			[options.letterWidth, grid.bottom],
			[grid.left, grid.bottom / 2],
			[options.letterWidth, grid.bottom / 2],
			[grid.left, grid.top],
			[options.letterWidth, grid.top]
		],
		G: [
			[options.letterWidth / 2, grid.top],
			[grid.left - options.letterWidth / 2, grid.top],
			[grid.left, grid.bottom],
			[options.letterWidth, grid.bottom],
			[options.letterWidth - options.letterWidth / 2 / 2, grid.bottom / 2],
			[grid.left, grid.bottom]
		],
		H: [
			[grid.left, grid.bottom],
			[grid.left, grid.top],
			[grid.left - options.letterWidth / 15, grid.bottom / 2],
			[options.letterWidth, grid.bottom / 2],
			[options.letterWidth - options.letterWidth / 15, grid.top],
			[options.letterWidth - options.letterWidth / 15, grid.bottom]
		],
		I: [
			[options.letterWidth / 2, grid.top],
			[options.letterWidth / 2, grid.bottom]
		],
		J: [
			[options.letterWidth / 1.5, grid.top],
			[options.letterWidth, grid.top],
			[options.letterWidth, grid.bottom / 1.5],
			[grid.left, grid.bottom]
		],
		K: [
			[grid.left, grid.top],
			[grid.left, grid.bottom],
			[grid.left, grid.bottom / 2],
			[options.letterWidth, grid.top],
			[options.letterWidth / 3, grid.bottom / 2],
			[options.letterWidth, grid.bottom]
		],
		L: [
			[grid.left, grid.top],
			[grid.left, grid.bottom],
			[options.letterWidth, grid.bottom]
		],
		M: [
			[grid.left, grid.bottom],
			[grid.left, grid.top],
			[options.letterWidth / 2, grid.bottom / 2],
			[options.letterWidth, grid.top],
			[options.letterWidth, grid.bottom]
		],
		N: [
			[grid.left, grid.bottom],
			[grid.left, grid.top],
			[options.letterWidth, grid.bottom],
			[options.letterWidth, grid.top]
		],
		O: [
			[grid.left, grid.bottom / 10],
			[options.letterWidth, grid.bottom / 10],
			[options.letterWidth, grid.bottom],
			[grid.left, grid.bottom],
			[grid.left, grid.bottom / 10]
		],
		P: [
			[grid.left, grid.bottom],
			[grid.left, grid.top],
			[options.letterWidth, grid.top],
			[options.letterWidth, grid.bottom / 2],
			[grid.left, grid.bottom / 2]
		],
		R: [
			[grid.left, grid.bottom],
			[grid.left, grid.top],
			[options.letterWidth, grid.top],
			[options.letterWidth, grid.bottom / 3],
			[options.letterWidth / 3, grid.bottom / 2],
			[options.letterWidth, grid.bottom]
		],
		S: [
			[options.letterWidth / 2, grid.top],
			[grid.left, grid.top],
			[grid.left, grid.bottom / 2],
			[options.letterWidth, grid.bottom / 2],
			[options.letterWidth, grid.bottom],
			[options.letterWidth / 2, grid.bottom]
		],
		U: [
			[grid.left, grid.top],
			[grid.left, grid.bottom],
			[options.letterWidth, grid.bottom],
			[options.letterWidth, grid.top]
		],
		T: [
			[grid.left - options.letterWidth / 2, grid.top],
			[options.letterWidth, grid.top],
			[options.space, grid.top],
			[options.space, grid.bottom]
		],
		Z: [
			[grid.left, grid.top],
			[options.letterWidth, grid.top],
			[grid.left, grid.bottom],
			[options.letterWidth, grid.bottom]
		],
		' ': [[grid.left, grid.top]]
	}
}

export { getLetters }
