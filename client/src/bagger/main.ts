import { Block, Dot, Line, PlacementDrawable, Zag } from '$bagger/blocks'
import { GridSize } from '$bagger/tileLayout'

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
	]
	shop = []
	// shop: Item[] = [new Dot(0, 0),new Dot(1, 0),new Dot(2, 0),new Dot(3, 0), new Zag(4,0), new Zag(6,0)]
}

export class GameViewModel implements ViewModel {
	bagSize: GridSize = new GridSize(340, 7, 8)
	shopSize: GridSize = new GridSize(340, 8, 4)
}

export class Game implements Context {
	view = new GameViewModel()
	data = new GameDataModel()

	moveItem(e: PlacementDrawable) {
		if (e.from !== 'bag' || e.to !== 'bag') {
			if (e.from === 'bag') {
				this.data.bag = this.data.bag.filter(it => it.id !== e.target.id)
			}
			this.data[e.to].push(e.target)
		}

		e.target.row = e.row
		e.target.col = e.col
	}
}

export interface Context {
	view
	data
}

export interface ViewModel {

}