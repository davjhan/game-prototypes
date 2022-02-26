import { Drawable } from '$bagger/drawable'
import { nanoid } from 'nanoid'

export class BlockType {
	readonly type: string
	layout: number[][]
}

export class Block implements Drawable {
	readonly id: string

	constructor(
		public block: BlockType,
		public col: number = 0,
		public row: number = 0,
	) {
		this.id = nanoid()
	}

	public get layout() {
		return this.block.layout
	}

	public copy() {
		return new Block(this.block, this.col, this.row)
	}
}

export class Dot extends BlockType {
	readonly type = 'dot'
	readonly layout = [[1]]
	readonly color = '#60a5fa'
}

export class Line extends BlockType {
	readonly type = 'line'
	readonly layout = [[1], [1]]
	readonly color = '#f9a8d4'
}

export class Zag extends BlockType {
	readonly type = 'dot'
	readonly layout = [
		[1, 0],
		[1, 1],
		[0, 1]
	]
	readonly color = '#bef264'
}

export class PlacementDrawable implements Drawable {
	target: Block
	row: number
	col: number
	layout: number[][]
	from: string
	to: string

	constructor({ item, row, col, from, to }: {
		item: Block
		row: number
		col: number
		from: string
		to: string
	}) {
		this.target = item
		this.row = row
		this.col = col
		this.layout = item.layout
		this.from = from
		this.to = to
	}
}