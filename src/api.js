import server from 'socket.io'
import { actions, customAction } from './action'

var io

const connect = (services, httpServer) => {
  return new Promise(resolve => {
    io = server.listen(httpServer)
    io.on('connection', app => {
      dispatch(actions.connect(app.request.user, app.id))

      for (let current of Object.keys(services)) {
        if (!services[current].initialiser) continue

        services[current].initialiser().then((results) => {
          dispatch(customAction(current + '_init', results, app.id))
        })
      }

      app.on('client_message', (action, next) => {
        if (!action.app) action.app = app.id
        for (let key in services) {
          var processor = services[key].processor
          if (!processor) continue
          processor(action, next, data => broadcastOthers(app, actions.response(action, data)))
        }
      })
    })
    resolve(io)
  })
}

const dispatch = (action) => {
  if (!action.app) {
    console.error('Error: the action being dispatch from the API has no App property.')
    return
  }

  action.fromServer = true
  io.to(action.app).emit('server_message', action)
}

const broadcastOthers = (app, action) => {
  action.fromServer = true
  app.broadcast.emit('server_message', action)
}

export default connect
