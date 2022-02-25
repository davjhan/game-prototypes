import { nanoid } from 'nanoid'

export interface Placeable {
	row: number
	col: number
	layout: number[][]
}

export class Item implements Placeable {
	readonly id: string
	readonly type: string
	readonly color: string
	readonly layout: number[][]

	constructor(
		public col: number,
		public row: number,
	) {
		this.id = nanoid()
	}

	toPlacement(from:string, to:string): Placement {
		return new Placement({ item: this, row: this.row, col: this.col, from, to })
	}
}

export class Dot extends Item {
	readonly type = 'dot'
	readonly layout = [[1]]
	readonly color = '#60a5fa'
}
export class Line extends Item {
	readonly type = 'line'
	readonly layout = [[1],[1]]
	readonly color = '#f9a8d4'
}
export class Zag extends Item {
	readonly type = 'dot'
	readonly layout = [
		[1, 0],
		[1, 1],
		[0, 1]
	]
	readonly color = '#bef264'
}

export class Placement implements Placeable {
	item: Item
	row: number
	col: number
	layout: number[][]
	from:string
	to:string

	constructor({ item, row, col, from, to}: {
		item: Item
		row: number
		col: number
		from:string
		to:string
	}) {
		this.item = item
		this.row = row
		this.col = col
		this.layout = item.layout
		this.from = from
		this.to = to
	}
}