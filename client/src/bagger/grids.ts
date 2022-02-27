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

	setSafely(col: number, row: number, value: T) {
		if (col < 0 || row < 0 || col > this.cols - 1 || row > this.rows - 1) return
		this.data[row][col] = value
	}

	set(col: number, row: number, value: T) {
		this.data[row][col] = value
	}

	get(col: number, row: number): T {
		return Layouts.getSafely(this.data, col, row)
	}

	trimEnd(): Grid<T> {
		/* Trims the ends of empty rows and cols. */
		let endRow = this.rows
		for (let r = this.data.length - 1; r >= 0; r--) {
			/* Start from the end, and break if we encounter a row with at least 1 truthy value. */
			if (!this.data[r].every(it => !it)) {
				endRow = r + 1
				break
			}
		}

		/* Get start and end col */
		let endCol = 0
		for (let row of this.data) {
			for (let c = row.length - 1; c >= 0; c--) {
				if (row[c]) {

					endCol = Math.max(endCol, c + 1)
					break
					/* Optimization. If c is already the end, return c */

				}
			}
			if (endCol === this.cols) break
		}
		return new Grid(this.data.slice(0, endRow).map(col => col.slice(0, endCol)))
	}

	neighbours(col: number, row: number) {
		return [
			this.get(col - 1, row),
			this.get(col + 1, row),
			this.get(col, row - 1),
			this.get(col, row + 1),
		].filter(it => it)
	}

	mapEachCell<R>(each: (item: T, col: number, row: number) => R) {
		return this.data.map((row, r) => row.map((it, c) => each(it, c, r)))
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

export module Layouts {
	export type GridItem<T> = Partial<{
		col: number
		row: number
		layout: T[][]
	}>

	/** Updates the grid occupancy.
	 * @throws InvalidGridError if items are out of bounds. */
	export function toGrid<T extends GridItem<any>>(items: T[], cols: number, rows: number): Grid<GridValue<T>> {
		const grid = Grid.empty<GridValue<T>>(cols, rows)
		try {
			items.forEach(item => {
				/* For each item, mark the space it takes up */
				item.layout.forEach((layoutRow, r) => {
					layoutRow.forEach((cell, c) => {
						if (cell) {
							const col = item.col + c
							const row = item.row + r
							/* Overlap */
							if (grid.get(col, row)) throw new InvalidGridError()
							grid.set(col, row, {
								value: cell,
								group: item,
							})
						}
					})
				})
			})
			return grid
		} catch (e) {
			console.log(`INV`,)
			return undefined
		}
	}

	/* Returns a layout with the layouts merged */
	export function combine<T>(
		items: GridItem<T>[],
		cols = 32,
		rows = 32,
	): GridItem<T> {

		const grid = Grid.empty<T>(cols, rows)
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
						grid.set(col, row, cell)
					}
				})
			})
		})
		return {
			layout: grid.trimEnd().data,
			col: originCol,
			row: originRow
		}
	}

	/* Helper method to iterate over every value */
	export function mapCells<T, R>(layout: T[][], each: (item: T, col: number, row: number) => R) {
		return layout.map((row, r) => row.map((it, c) => each(it, c, r)))
	}

	/* Helper method to iterate over every value */
	export function flatMapCells<T, R>(layout: T[][], each: (item: T, col: number, row: number) => R[]) {
		return layout.flatMap((row, r) => row.flatMap((it, c) => each(it, c, r)))
	}

	/* Silences Index out of bounds errors */
	export function getSafely<T>(layout: T[][], col: number, row: number) {
		try {
			return layout[row][col]
		} catch (e) {}
	}

	/* Whether or not a given grid item is within bounds */
	export function isOutOfBounds<T>(gridItem: GridItem<T>, cols: number, rows: number) {
		return (
			gridItem.row < 0 ||
			gridItem.row + gridItem.layout.length - 1 > rows - 1 ||
			gridItem.col < 0 ||
			gridItem.col + gridItem.layout[0].length - 1 > cols - 1
		)
	}
}

export class InvalidGridError extends Error {
	message = 'Invalid grid'
}