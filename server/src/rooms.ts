import { WebSocket } from 'ws'

export const rooms: Record<string, Room> = {
	'default': newRoom('default')
}

interface Room {
	code: string
	connections: Set<WebSocket>
}

function newRoom(code: string): Room {
	if (!code) code = 'defaultRoom2'
	return {
		code,
		connections: new Set<WebSocket>()
	}
}

export function getRoom(code: string): Room {
	return rooms[code]
}

export function joinRoom(room: Room, ws: WebSocket) {
	room.connections.add(ws)
	console.debug(`${ getRoomLabel(room) } [] has joined the room.`)
}

export function leaveRoom(room: Room, ws: WebSocket) {
	room.connections.delete(ws)
	console.debug(`${ getRoomLabel(room) } [${ ws.url }] has been removed from the room.`)
}

function getRoomLabel(room: Room) {
	return `(Room '${ room.code }'] ppl:${ room.connections.size })`
}