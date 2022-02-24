import { Size } from '$bagger/cabinet'
import { Dot, Item, Placeable, Placement, Zag } from '$bagger/items'

export interface DragEvent extends Placeable {
	item: Item
	x: number
	y: number
	from: string
}

export class GameDataModel {
	bag: Item[] = []
	shop: Item[] = [new Dot(0, 0),new Dot(1, 0),new Dot(2, 0),new Dot(3, 0), new Zag(4,0), new Zag(6,0)]
}

export class GameViewModel implements ViewModel {
	bagSize: Size = new Size(340, 8,5)
	shopSize: Size = new Size(340, 8, 4)
}

export class Game implements Context {
	view = new GameViewModel()
	data = new GameDataModel()

	moveItem(e: Placement) {
		if (e.from !== e.to) {
			this.data[e.from] = this.data[e.from].filter(it => it !== e.item)
			this.data[e.to].push(e.item)
		}

		e.item.row = e.row
		e.item.col = e.col
	}
}

export interface Context {
	view
	data
}

export interface ViewModel {

}