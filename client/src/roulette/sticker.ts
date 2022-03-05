export class Sticker {
	/* Shape is normalized to a [-100,+100] grid */
	radius = 10
	color = '#bef264'
	type: string
	price: number
	name: string
	description: string

	constructor(readonly x: number, readonly y: number, readonly owner: string) {
	}

	static clone(sticker: Partial<Sticker>): Sticker {
		return {
			type: sticker.type,
			x: sticker.x,
			y: sticker.y,
			radius: sticker.radius,
			description: sticker.description,
			name: sticker.name,
			color: sticker.color,
			price: sticker.price,
			owner: sticker.owner,
		}
	}
}

export class BasicSticker extends Sticker {
	type = 'basic'
	name = 'Basic'
	price = 3
	description = 'Win 3$ if the wheel lands on it.'
}

export class StickerPlacementAction extends Sticker {

}