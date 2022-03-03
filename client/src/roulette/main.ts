import { createNanoEvents, EventsMap } from 'nanoevents'
import { writable } from 'svelte/store'
import { Writable } from 'svelte/types/runtime/store'
import { Luck } from '../common/utils'
import { Sticker } from './sticker'

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
	type:RoulettePhaseType = 'buy'

	constructor(readonly round: number) {super()}

}

export class RouletteGameModel {
	stickers = [new Sticker(40, 20, 'david'), new Sticker(80, -30, 'david'), new Sticker(20, -30, 'david')]

	phase: SpinPhase | BuyPhase = new BuyPhase(0)
}

interface RouletteEvents {
	phaseChange : (next: RoulettePhase, prev: RoulettePhase) => void,
}

export class RouletteGameClient {
	private model = new RouletteGameModel()
	readonly store: Writable<RouletteGameModel> = writable(this.model)
	readonly events = createNanoEvents<RouletteEvents>()

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
			phase: new BuyPhase(phase.round + 1)
		}
		this.onModelChange(newModel)
	}

	private onModelChange(newModel: RouletteGameModel) {
		const prevModel = this.model
		if (newModel.phase.type !== prevModel.phase.type) {
			/* Phase changed */
			this.events.emit('phaseChange', newModel.phase, prevModel.phase )
		}

		/* Update model and notify observers */
		this.model = newModel
		this.store.set(newModel)
	}
}