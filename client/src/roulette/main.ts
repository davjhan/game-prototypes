import { createNanoEvents } from 'nanoevents'
import { writable } from 'svelte/store'
import { Writable } from 'svelte/types/runtime/store'
import { Luck } from '../common/utils'
import { ProductSelection } from './shop'
import { BasicSticker, Sticker } from './sticker'

type RoulettePhaseType = 'spin' | 'buy'

export class RoulettePhase {
	type: RoulettePhaseType
	round:number = 0
	stickers:Sticker[] = []
	rotation:number = 0
	constructor(props: Partial<RoulettePhase>) {
		if(props.round  !== undefined) this.round = props.round
		if(props.stickers !== undefined) this.stickers = props.stickers
		if(props.rotation  !== undefined) this.rotation = props.rotation
	}
}

export class SpinPhase extends RoulettePhase {
	type: RoulettePhaseType = 'spin'
	landedSticker?:Sticker
	constructor(
		base: Partial<RoulettePhase>,
		readonly spinertia: number  = 3000+Luck.randomInt(0, 360)
	) {
		super(base)
		// this.landedSticker =
	}
}

export class BuyPhase extends RoulettePhase {
	static newRoundMoney = 10
	type: RoulettePhaseType = 'buy'
	constructor(
		base: Partial<RoulettePhase>
	) {
		super(base)
	}
}


export class RouletteGameModel {


	phase: SpinPhase | BuyPhase = new SpinPhase({
		stickers: [new BasicSticker(0, -90, 'david'), new BasicSticker(30, 0, 'david'), new BasicSticker(20, -30, 'david')]
	}, 3240) // 9 complete spins
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
			phase: new SpinPhase({...phase}, 3240)
		}
		this.onModelChange(newModel)
		return true
	}

	gotoBuyPhase() {
		/* Must be at shop phase. */
		if (this.model.phase.type !== 'spin') return
		const phase = this.model.phase as SpinPhase
		const newModel: RouletteGameModel = {
			...this.model,
			phase: new BuyPhase( {
				...phase,
				round: phase.round + 1,
				rotation:(phase.rotation + phase.spinertia)%360,
			}),
			money: this.model.money + BuyPhase.newRoundMoney,
		}
		this.onModelChange(newModel)
	}

	buySticker(product: ProductSelection) {
		this.onModelChange({
			...this.model,
			phase: {
				...this.model.phase,
				stickers: this.model.phase.stickers.concat([Sticker.clone(product)]),
			},
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