import { Context } from 'koa'
import { nanoid } from 'nanoid'
import WebSocket, { CloseEvent, ErrorEvent } from 'ws'
import { MessageRouter, parseJson } from '../../common/message'
import { getRoom, joinRoom, leaveRoom } from './rooms'

export class GameServer {
	messageRouter = new MessageRouter()
	ws: WebSocket

	connect(ctx: Context, params: { roomId: string }) {
		this.ws = ctx.websocket
		const room = getRoom(params.roomId)
		if (!room) this.ws.close(404)
		this.ws.once('close', (e: CloseEvent) => {
			leaveRoom(room, this.ws)
		})

		this.ws.on('error', (e: ErrorEvent) => {

		})

		this.ws.on('message', (data) => {
			const payload = parseJson(data)
			if (!payload) return
			try {
				this.messageRouter.handle(payload, this.ws)
			} catch (e) {
				if (e.close) this.ws.close(e.code, e.message)
				else this.ws.send(JSON.stringify({ type: 'error', ...e }))
			}
		})

		joinRoom(room, this.ws)

	}

	onMessage(type: string, handler: (any, WebSocket) => void) {
		this.messageRouter.on(type, handler)
	}
}


interface User {
	id: string
	name: string
	ws: WebSocket
}

export class AddressBook {

	users: Record<string, User> = {}

	getUser(id: string): User {
		return this.users[id]
	}

	addUser(name: string, ws: WebSocket): User {
		const user: User = {
			id: nanoid(),
			name,
			ws
		}
		if (Object.values(this.users).find(it => it.ws === ws)) throw new AlreadyAuthenticatedError()
		this.users[user.id] = user
		return user
	}

	removeUser(id: string) {
		this.users[id] = undefined
	}


}

export class AlreadyAuthenticatedError extends Error {
	readonly code = 1000
	readonly close = true
	readonly message = '2 auth events received from the same socket.'
}