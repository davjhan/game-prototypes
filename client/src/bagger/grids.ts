import { Block } from '$bagger/blocks'

const canvasWidth = 340

export type GridValue<T> = {
	value: any
	group: T
}

export class Grid<T> {
	rows: number
	cols: number

	constructor(public data: T[][]) {
		this.rows = data.length
		this.cols = Math.min(...data.map(it => it.length))
	}

	static empty<T>(cols, rows, defaultValue = 0) {
		return new Grid<T>(Array(rows).fill(defaultValue).map(() => new Array(cols).fill(defaultValue)))
	}

	set(col: number, row: number, value: T) {
		if (col < 0 || row < 0 || col > this.cols - 1 || row > this.rows - 1) throw new Error('Index out of bounds')
		this.data[row][col] = value
	}

	get(col: number, row: number): T {
		if (col < 0 || row < 0 || col > this.cols - 1 || row > this.rows - 1) return undefined

		return this.data[row][col]
	}

	trimmed(): Grid<T> {
		/* get start and end row. */
		let startRow = 0, endRow = this.rows - 1, middleRowEncountered = false
		for (let [r, row] of this.data.entries()) {
			if (row.every(it => !it)) {
				if (!middleRowEncountered) {
					startRow = Math.max(startRow, r)
				} else {
					endRow = r
					break
				}
			} else {
				middleRowEncountered = true
			}
		}
		/* Get start and end col */
		let startCol = this.cols, endCol = 0
		for (let row of this.data) {
			let encounteredDefined = false
			for (let [c, value] of row.entries()) {
				if (value) {
					if (!encounteredDefined) {
						startCol = Math.min(startCol, Math.max(0, c - 1))
						encounteredDefined = true
					}
				} else {
					if (encounteredDefined) {
						endCol = Math.max(endCol, c)
						encounteredDefined = true
						break
					}
				}
			}
		}
		return new Grid(this.data.slice(startRow, endRow).map(col => col.slice(startCol, endCol)))
	}

	neighbours(col: number, row: number) {
		return [
			this.get(col - 1, row),
			this.get(col + 1, row),
			this.get(col, row - 1),
			this.get(col, row + 1),
		].filter(it => it)
	}
}

export class GridSize {
	boundsW: number
	boundsH: number
	cell: number
	halfCell: number

	constructor(canvasWidth: number, readonly cols: number, readonly rows: number,) {
		this.boundsW = canvasWidth
		this.boundsH = canvasWidth * (rows / cols)
		this.cell = (canvasWidth - 4) / cols
		this.halfCell = this.cell / 2

	}
}

export module LayoutGrid {
	/** Updates the grid occupancy.
	 * @throws InvalidGridError if items are out of bounds. */
	export function layoutItems(items: Block[], cols: number, rows: number): Grid<GridValue<Block>> {
		const grid = Grid.empty<GridValue<Block>>(cols, rows)
		try {
			items.forEach(item => {
				/* For each item, mark the space it takes up */
				item.layout.forEach((layoutRow, r) => {
					layoutRow.forEach((cell, c) => {
						if (cell) {

							const col = item.col + c
							const row = item.row + r
							if (row < 0 || row > rows - 1 || col < 0 || col > cols - 1) {
								/* Index out of bounds. */

								throw new InvalidGridError()
							}
							/* Overlap */
							if (grid.get(col, row)) throw new InvalidGridError()
							grid.set(col, row, {
								value: 1,
								group: item,
							})
						}
					})
				})
			})
			return grid
		} catch (e) {
			return undefined
		}
	}

	/* Returns a layout with the layouts merged */
	export function mergeLayouts(
		items: Block[],
		cols = 32,
		rows = 32,
	): { layout: number[][], col: number, row: number } {

		const grid = Grid.empty<number>(cols, rows)
		const originCol = Math.min(...items.map(it => it.col))
		const originRow = Math.min(...items.map(it => it.row))
		items.forEach(item => {
			/* For each item, mark the space it takes up */
			item.layout.forEach((layoutRow, r) => {
				layoutRow.forEach((cell, c) => {
					if (cell) {

						const col = item.col + c - originCol
						const row = item.row + r - originRow
						if (row < 0 || row > rows - 1 || col < 0 || col > cols - 1) {
							/* Index out of bounds. */
							throw new InvalidGridError()
						}
						/* Overlap */
						if (grid.get(col, row)) throw new InvalidGridError()
						grid.set(col, row, 1)
					}
				})
			})
		})
		return {
			layout: grid.trimmed().data,
			col: originCol,
			row: originRow
		}

	}
}

export class InvalidGridError extends Error {
	message = 'Invalid grid'
}