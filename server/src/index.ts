import Router from '@koa/router'
import Koa from 'koa'
import websockify from 'koa-websocket'
import UrlPattern from 'url-pattern'
import { newClimberGame } from './ClimberGame'

const app = websockify(new Koa())
const router = new Router()

const game = newClimberGame()

app.ws.use((ctx) => {
	const route = new UrlPattern('/game/:roomId')
	const routeMatch = route.match(ctx.url)
	if (routeMatch) game.connect(ctx, routeMatch)
	else ctx.websocket.close(1000)
})

app.use(router.routes())
	.use(router.allowedMethods)

app.listen(8080)
console.log('✨ Server listening on :8080')