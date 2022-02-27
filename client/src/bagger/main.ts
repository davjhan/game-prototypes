import { Block, Dot, Line, PlaceAction, Zag } from '$bagger/blocks'
import { Grid, GridSize, GridValue, LayoutGrid } from '$bagger/grids'
import layoutItems = LayoutGrid.layoutItems

export interface DroppablePayloadEvent<T> {
	payload: T
	x: number
	y: number
	from: string
}

export class GameDataModel {
	bag: Block[] = [
		new Block(new Line(), 2, 0),
		new Block(new Zag(), 3, 0),
		new Block(new Dot(), 4, 0),
		new Block(new Dot(), 4, 3),
	]
	points:number = 0
	shop = []
	// shop: Item[] = [new Dot(0, 0),new Dot(1, 0),new Dot(2, 0),new Dot(3, 0), new Zag(4,0), new Zag(6,0)]
}

export class GameViewModel implements ViewModel {
	bagSize: GridSize = new GridSize(340, 7, 8)
}

export class Game implements Context {
	view = new GameViewModel()
	data = new GameDataModel()
	grid: Grid<GridValue<Block>>

	moveItem(e: PlaceAction) {
		if (e.from !== 'bag' || e.to !== 'bag') {
			if (e.from === 'bag') {
				this.data.bag = this.data.bag.filter(it => it.id !== e.block.id)
			}
			this.data[e.to].push(e.block)
		}

		e.block.row = e.row
		e.block.col = e.col
		this.grid = layoutItems(this.data.bag, this.view.bagSize.cols, this.view.bagSize.rows)

		this.combineItems(e.block)

	}

	combineItems(target:Block) {
		const toCombine = this.shouldCombineItems(target)
		if (toCombine) {
			this.data.bag = this.data.bag.filter(it => !toCombine.includes(it))
			const combinedItem = Block.combine(toCombine)
			this.data.bag.push(combinedItem)
			this.data.points ++
		}

	}

	private shouldCombineItems(target:Block): Block[] | undefined {
		const results = new Set<Block>()
		const neighbors = new Set<GridValue<Block>>(
			target.layout
				.flatMap((layoutRow, r) => layoutRow.flatMap(
						(item, c) => item ? this.grid.neighbours(c+target.col, r + target.row) : []
					)
				)
		)
		for (let neighbor of neighbors) {
			if (target === neighbor.group) continue
			if (target.type.color === neighbor.group.type.color) {
				results.add(neighbor.group)
			}
		}
		if (results.size > 0) return [...results, target]
	}
}

export interface Context {
	view
	data
}

export interface ViewModel {

}