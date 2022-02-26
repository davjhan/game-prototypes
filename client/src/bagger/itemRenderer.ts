import { BlockType } from '$bagger/blocks'

const cornerRadius = 4

export function render(item: BlockType, cellSize: number, className: string = '', fill: string = '#fff') {
	const points = makeItemShape(item, cornerRadius / cellSize)
	// console.log(`%c Points: ${ JSON.stringify(points) }`, 'color:yellow')

	const path = points.join(' ')
	return `
	<svg width='${ item.layout[0].length * cellSize }' height= '${ item.layout.length * cellSize }'
		class='pointer-events-none ${ className } '
	 	stroke='black' 
	 	stroke-width='2'
	 	fill=${ fill }
	 	overflow='visible'
	 	viewBox='0 0 ${ item.layout[0].length }  ${ item.layout.length }'
	  >
	<path	class='pointer-events-auto'  d='${ path }' vector-effect='non-scaling-stroke'></path>
	</svg>
	`
}

/**
 *  Starts, and walks clockwise along edge to build a svg path command to draw the shape.
 *  */
function makeItemShape(
	item: BlockType,
	radius: number = 0.3,
) {
	const path: string[] = []
	let dir = 'right'
	const start = new Point(0, 0)
	const insetPoint = start.copy().move(dir, radius)

	path.push(`M ${ insetPoint.x } ${ insetPoint.y }`)

	let cur = start.copy()

	do {
		cur.move(dir)
		const borderCells = cur.borderCells(dir)

		const filledInside = get(item.layout, borderCells.inside)
		const filledOutside = get(item.layout, borderCells.outside)

		if (filledInside && filledOutside) {
			/* At a wall. Turn left */
			const beforeCorner = cur.copy().move(opposite(dir), radius / 2)
			dir = turnLeft(dir)
			const afterCorner = cur.copy().move(dir, radius / 2)
			path.push(`L ${ beforeCorner.x } ${ beforeCorner.y } S ${ cur.x } ${ cur.y } ${ afterCorner.x } ${ afterCorner.y }`)
		} else if (!filledInside && !filledOutside) {
			/* Turn right */
			const beforeCorner = cur.copy().move(opposite(dir), radius)
			dir = turnRight(dir)
			const afterCorner = cur.copy().move(dir, radius)
			path.push(`L ${ beforeCorner.x } ${ beforeCorner.y } S ${ cur.x } ${ cur.y } ${ afterCorner.x } ${ afterCorner.y }`)


		}
	} while (cur.x !== start.x || cur.y !== start.y)

	return path
}

const directions = ['up', 'right', 'down', 'left']

type Direction = typeof directions[number]

class Point {
	constructor(
		public x: number = 0,
		public y: number = 0,
	) {}

	move(dir: Direction, amount = 1) {
		switch (dir) {
			case 'up':
				this.y -= amount
				return this
			case 'right':
				this.x += amount
				return this
			case 'down':
				this.y += amount
				return this
			case 'left':
				this.x -= amount
				return this
		}
	}

	/*
	 * Assuming that we're walking in a clockwise direction, the coords of the cells inside and outside this point.
	 *
	 * O───┐
	 * │   │
	 * └───┘
	 * */
	borderCells(dir: Direction): { inside: [number, number], outside: [number, number] } {
		switch (dir) {
			case 'up':
				/* In: Right, Out: LEft */
				return { inside: [this.x, this.y - 1], outside: [this.x - 1, this.y - 1] }
			case 'right':
				/* In: Down, Out: Up */
				return { inside: [this.x, this.y], outside: [this.x, this.y - 1] }
			case 'down':
				/* In: Left, Out: Right */
				return { inside: [this.x - 1, this.y], outside: [this.x, this.y] }
			case 'left':
				/* In: Up, Out: Down */
				return { inside: [this.x - 1, this.y - 1], outside: [this.x - 1, this.y] }
		}

	}

	copy() {
		return new Point(this.x, this.y)
	}
}

function get(layout: number[][], coords: [number, number]) {
	if (coords[0] < 0 || coords[0] > layout[0].length - 1 || coords[1] < 0 || coords[1] > layout.length - 1) {
		return undefined
	}
	return layout[coords[1]][coords[0]]
}

function turnRight(dir: Direction): Direction {
	return directions[(directions.indexOf(dir) + 1) % 4]
}

function turnLeft(dir: Direction): Direction {
	return directions[(4 + directions.indexOf(dir) - 1) % 4]
}

function opposite(dir: Direction): Direction {
	return directions[(directions.indexOf(dir) + 2) % 4]
}