import WebSocket from 'ws'
import { AuthMessage } from '../../common/message'
import { AddressBook, GameServer } from './GameServer'

export function newClimberGame() {
	const game = new GameServer()
	const addressBook = new AddressBook()
	game.onMessage('auth', (msg: AuthMessage, ws: WebSocket) => {
		if (!msg.name) ws.close(400)
		addressBook.addUser(msg.name, ws)
		console.log(`Welcome`, msg.name)
	})
	return game
}