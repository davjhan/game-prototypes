import WebSocket from 'ws'

export type MessageHandler = (any, WebSocket)=>void
export class MessageRouter{
	listeners: Record<string,MessageHandler[]>
	constructor() {
		this.listeners = {}
	}

	on(type:string, handler:MessageHandler){
		if(!this.listeners[type]) this.listeners[type] = []
		this.listeners[type].push(handler)
	}
	handle(message:any, ws:WebSocket){
		if(!this.listeners[message.type]) return
		this.listeners[message.type].forEach(handler =>{
			handler(message, ws)
		})
	}
}

export type AuthMessage = {
	type: 'auth'
	name: string
}

export function parseJson(data:WebSocket.Data):any{
	if(typeof data === 'string'){
		try{
			return JSON.parse(data)
		}catch (e){
			return undefined
		}
	}
	return undefined
}