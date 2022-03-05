import { createNanoEvents } from 'nanoevents'
import { writable } from 'svelte/store'
import { Writable } from 'svelte/types/runtime/store'
import { Luck } from '../common/utils'
import { ProductSelection } from './shop'
import { BasicSticker, Sticker } from './sticker'

type RoulettePhaseType = 'spin' | 'buy'

export class RoulettePhase {
	type: RoulettePhaseType
	round = 0
}

export class SpinPhase extends RoulettePhase {
	type: RoulettePhaseType = 'spin'
	spinertia: number = Luck.randomInt(0, 360)

	constructor(readonly round: number) {super()}
}

export class BuyPhase extends RoulettePhase {
	static newRoundMoney = 10
	type: RoulettePhaseType = 'buy'
	rotation: number = 0

	constructor(readonly round: number) {super()}
}


export class RouletteGameModel {
	stickers = [new BasicSticker(0, 90, 'david'), new BasicSticker(30, 0, 'david'), new BasicSticker(20, -30, 'david')]

	phase: SpinPhase | BuyPhase = new BuyPhase(0)
	money: number = 10
}

export interface RouletteEvents {
	phaseChange: (next: RoulettePhase, prev: RoulettePhase) => void,
	stickerProductSelected: (sticker: Sticker) => void,
}

export class RouletteGameClient {
	readonly events = createNanoEvents<RouletteEvents>()
	private model = new RouletteGameModel()
	readonly store: Writable<RouletteGameModel> = writable(this.model)

	gotoSpinPhase() {
		/* Must be at shop phase. */
		console.log(`model`, this.model)
		if (this.model.phase.type !== 'buy') return

		const phase = this.model.phase as BuyPhase
		const newModel: RouletteGameModel = {
			...this.model,
			phase: new SpinPhase(phase.round)
		}
		this.onModelChange(newModel)
		return true
	}

	gotoBuyPhase() {
		/* Must be at shop phase. */
		if (this.model.phase.type !== 'spin') return
		const phase = this.model.phase as BuyPhase
		const newModel: RouletteGameModel = {
			...this.model,
			phase: new BuyPhase(phase.round + 1),
			money: this.model.money + BuyPhase.newRoundMoney,
		}
		this.onModelChange(newModel)
	}

	buySticker(product: ProductSelection) {
		this.onModelChange({
			...this.model,
			stickers: this.model.stickers.concat([Sticker.clone(product)]),
			money: this.model.money - product.price,
		})
	}

	private onModelChange(newModel: RouletteGameModel) {
		const prevModel = this.model
		if (newModel.phase.type !== prevModel.phase.type) {
			/* Phase changed */
			this.events.emit('phaseChange', newModel.phase, prevModel.phase)
		}

		/* Update model and notify observers */
		this.model = newModel
		this.store.set(newModel)
	}
}