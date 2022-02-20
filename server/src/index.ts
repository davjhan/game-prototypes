import Router from '@koa/router'
import Koa, { Context, Middleware } from 'koa'
import websockify from 'koa-websocket'
import { enterGame } from './game'

const app = websockify(new Koa())
const router = new Router()

app.ws.use((ctx) => {
	enterGame(ctx)
})

app.use(router.routes())
	.use(router.allowedMethods)

app.listen(3000)
console.log('✨ Server listening on :3000')