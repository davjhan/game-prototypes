import { Layouts } from '$bagger/grids'
import { nanoid } from 'nanoid'

export class BlockType {
	readonly type: string
	layout: number[][]
	color: string
}

export class Block implements Layouts.GridItem<number> {
	readonly id: string

	constructor(
		public type: BlockType,
		public col: number = 0,
		public row: number = 0,
	) {
		this.id = nanoid()
	}

	public get layout() {
		return this.type.layout
	}

	static combine(blocks: Block[]): Block {
		const layoutMerge = Layouts.combine(blocks)
		const blockType: BlockType = {
			layout: layoutMerge.layout,
			type: nanoid(),
			color: blocks[0].type.color
		}
		return new Block(blockType, layoutMerge.col, layoutMerge.row)
	}
}

export class Dot extends BlockType {
	readonly type = 'dot'
	readonly layout = [[1]]
	readonly color = '#93c5fd'
}

export class Line extends BlockType {
	readonly type = 'line'
	readonly layout = [[1], [1]]
	readonly color = '#bef264'
}

export class Zag extends BlockType {
	readonly type = 'dot'
	readonly layout = [
		[1, 0],
		[1, 1],
		[0, 1]
	]
	readonly color = '#fca5a5'
}

export class Tee extends BlockType {
	readonly type = 'tee'
	readonly layout = [
		[0, 1],
		[1, 1],
		[0, 1]
	]
	readonly color = '#c4b5fd'
}

export class PlaceAction {
	block: Block
	row: number
	col: number
	layout: any[][]
	from: string
	to: string

	constructor({ block, row, col, from, to }: {
		block: Block
		row: number
		col: number
		from: string
		to: string
	}) {
		this.block = block
		this.row = row
		this.col = col
		this.layout = block.layout
		this.from = from
		this.to = to
	}
}