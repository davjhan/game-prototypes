import { handleRequest } from './handler'
import { startWebsocket } from './websockets'

export default {
  // * request is the same as `event.request` from the service worker format
  // * waitUntil() and passThroughOnException() are accessible from `ctx` instead of `event` from the service worker format
  // * env is where bindings like KV namespaces, Durable Object namespaces, Config variables, and Secrets
  // are exposed, instead of them being placed in global scope.
  async fetch(req: Request, env, context:ExecutionContext) {
    const upgradeHeader = req.headers.get("Upgrade")
    if (upgradeHeader == "websocket") {
      return startWebsocket(req, env)
    }else{
      return handleRequest(req)
    }

  }
}

export class GameRoom {
  private state: DurableObjectState
  private connections: WebSocket[]
  private gameState: {
    messages: string[]
  }
  constructor(state:DurableObjectState, env) {
    this.state = state
    this.gameState = { messages:[] }
    this.connections = []
  }
  async fetch(req:Request) {
    const body = await req.text()
    const webSocketPair = new WebSocketPair()
    const [client, server] = Object.values(webSocketPair)
    this.connections.push(server)
    server.accept()
    server.addEventListener('message', event => {
      console.log(event.data)
      this.connections.forEach(it =>{
        it.send(`New message: ${event.data}`)
      })
    })
    return new Response(undefined, {
      status: 101,
      webSocket: client
    })
  }
}