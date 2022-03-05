import { Sticker } from './sticker'

export type ProductSelection = Partial<Sticker> & {
	x: number
	y: number
	placed: boolean
	show: boolean
	isValid: boolean
}