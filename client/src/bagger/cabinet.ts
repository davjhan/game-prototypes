import { Item, Placeable } from './items'

const canvasWidth = 340

export class Size {
	boundsW: number
	boundsH: number
	item: number
	halfItem: number

	constructor(canvasWidth: number, readonly cols:number, readonly rows:number,) {
		this.boundsW = canvasWidth
		this.boundsH = canvasWidth * (rows / cols)
		this.item = canvasWidth / cols
		this.halfItem = this.item / 2

	}
}

export module LayoutGrid {
	/** Updates the grid occupancy.
	 * @throws InvalidGridError if items are out of bounds. */
	export function layoutItems( items: Placeable[], rows:number, cols:number):number[][]{
		const grid = new Array(rows).fill(0).map(() => new Array(cols).fill(0))
		try{
			items.forEach(item => {
				/* For each item, mark the space it takes up */
				item.layout.forEach((layoutRow, r) =>{
					layoutRow.forEach((cell, c) =>{
						if(cell){

							const row = item.row + r
							const col = item.col + c
							if(row < 0 || row > rows-1 || col < 0 || col > cols-1){
								/* Index out of bounds. */

								throw new InvalidGridError()
							}
							/* Overlap */
							if(grid[row][col]) throw new InvalidGridError()
							grid[row][col] = 1
						}
					})
				})
			})
			return grid
		} catch (e) {
			return undefined
		}
	}
}

export class InvalidGridError extends Error{
	message = 'Invalid grid'
}