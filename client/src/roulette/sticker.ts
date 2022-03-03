import { Circle, Point } from '@mathigon/euclid'

export class Sticker {
	/* Shape is normalized to a [-100,+100] grid */
	shape: Circle
	radius = 10
	color = '#bef264'

	constructor(x: number, y: number, readonly owner:string) {
		this.shape = new Circle(new Point(x, y), this.radius)
	}
}