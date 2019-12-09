const INITIAL_DIMENSION = (innerHeight - 40) / 6

state({
	dimension: INITIAL_DIMENSION,
	degrees: 0,
	blur: 0,
	board: Array(9).fill(-1)
})

let move = 0 // 0 : red, 1 : yellow
let direction = 0
let blurDirection = 0

const resetGameWithMessage = message => {
	alert(message)
	state('board', Array(9).fill(-1))
}

const boardCheck = (s1, s2, s3) => {
	const { board } = state

	return board[s1] === move && board[s2] === move && board[s3] === move
}

const checkWinner = () => {
	for (const arr of [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 4, 8],
		[1, 4, 7],
		[0, 3, 6],
		[2, 4, 6],
		[2, 5, 8]
	]) {
		const didWin = boardCheck(...arr)

		if (didWin)
			return resetGameWithMessage(`${move ? 'red' : 'yellow'} has won`)

		const isFull = !state.board.filter(x => !~x).length

		if (isFull)
			return resetGameWithMessage('It\'s a tie!')
	}
}

const backgroundForCell = cell => {
	switch (cell) {
		case -1:
			return 'white'
		case 0:
			return 'yellow'
		case 1:
			return 'red'
	}
}

setInterval(() => {
	const { dimension, blur } = state

	dimension <= INITIAL_DIMENSION / 2 || dimension >= INITIAL_DIMENSION * 2
		? direction ^= 1
		: undefined

	blur <= 0 || blur >= 20
		? blurDirection ^= 1
		: undefined

	state('dimension', dimension + (direction || -1) * 10)
	state('degrees', State.increment)
	state('blur', blur + (blurDirection || -1))
}, 1000 / 60)

const oscillatingCircle = (id) =>
	div()
		.style({
			display: 'inline-block',
			width: `${state.dimension}px`,
			height: `${state.dimension}px`,
			margin: '20px',
			'border-radius': '50%',
			border: '1px solid black',
			background: backgroundForCell(state.board[id])
		})
		.onMouseDown(() => {
			if (~state.board[id])
				return
			state('board', state.board.map((x, i) =>
				i === id ? move : x
			))
			checkWinner()
			move ^= 1
		})

const threeOscillatingCircles = (i) =>
	div()
		.children([
			oscillatingCircle(i),
			oscillatingCircle(i + 1),
			oscillatingCircle(i + 2)
		])

render(() => [
	div()
		.style({
			height: '100vh',
			display: 'grid',
			'align-content': 'center',
			'justify-content': 'center',
			transform: `rotate(${state.degrees}deg)`,
			filter: `blur(${state.blur}px)`
		})
		.children([
			threeOscillatingCircles(0),
			threeOscillatingCircles(3),
			threeOscillatingCircles(6)
		])
])