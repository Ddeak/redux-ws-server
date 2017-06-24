import server from 'socket.io'
import { connect, response } from './actions'

let io

const start = async (httpServer, handlers, initialiser) => {
  io = server.listen(httpServer)

  io.on('connection', async (client) => {
    let initialData = {}
    if (initialiser) initialData = await initialiser()

    dispatch(connect(client.id, initialData))

    client.on('redux websocket client message', (action, next) => {
      if (!action.clientId) action.clientId = client.id

      for (let handler of handlers) {
        handler(action, next, (data) => broadcastOthers(client, response(action, data)))
      }
    })
  })

  console.info('Websocket Server established successfully.')
  return io
}

const dispatch = (action) => {
  if (!action.clientId) {
    console.error('Error: the action being dispatch from the API has no clientId property.')
    return
  }

  action.fromServer = true
  io.to(action.clientId).emit('redux websocket server message', action)
}

const broadcastOthers = (client, action) => {
  action.fromServer = true
  client.broadcast.emit('redux websocket server message', action)
}

export default start
