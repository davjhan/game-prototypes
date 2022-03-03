export module Luck{

	export function randomInt(min, max) { // min and max included
		return Math.floor(Math.random() * (max - min + 1) + min)
	}
	export function pickRandom<T>(items:T[]){
		return items[randomInt(0, items.length-1)]
	}
}