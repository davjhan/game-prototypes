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
		public row: number,
		public col: number
	) {
		this.id = nanoid()
	}

	toPlacement(isValid:boolean = true):Placement{
		return newPlacement({item:this, isValid, row:this.row, col:this.col})
	}
}

export class Dot extends Item {
	readonly type = 'dot'
	readonly layout = [[1]]
	readonly color = '#60a5fa'
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

export interface ItemDragEvent extends Placeable {
	item: Item
	x: number
	y: number
}

export interface Placement extends Placeable {
	item: Item
	row: number
	col: number
	isValid: boolean
}

export function newPlacement({ item, row, col, isValid = false }: {
	item: Item,
	row: number,
	col: number,
	isValid: boolean
}): Placement {
	return {
		item,
		row,
		col,
		layout: item.layout,
		isValid,
	}
}