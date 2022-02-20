import { Context } from 'koa'
import { CloseEvent, ErrorEvent, Event } from 'ws'

export function enterGame(ctx: Context) {
	const ws = ctx.websocket

	ws.once('close', function (e: CloseEvent) {
		console.log(`closed`)
	})

	ws.on('error', function (e: ErrorEvent) {
		console.log(`ERROR`)
	})
	ws.once('message', function (e: Event) {
		console.log(`msg`)
	})

}