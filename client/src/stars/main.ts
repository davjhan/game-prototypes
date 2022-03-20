export class StarsGameModel{
	type:string
}
export class StarsGlobalModel{
	players: {
		id:string
	}
}
export class StarsGame{
	phase:StarsGameModel
	global: { }
}