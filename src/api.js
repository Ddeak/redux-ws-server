import server from 'socket.io'
import { actions, customAction } from './action'
import * as saml from '@gp-technical/stack-saml'

var io

const connect = (services, httpServer) => {
  return new Promise(resolve => {
    io = new server(httpServer)
		.use(saml.socketMiddleware)
		.on('connection', (app) => {
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

  action.fromApi = true
  io.to(action.app).emit('server_message', action)
}

const broadcastOthers = (app, action) => {
  action.fromApi = true
  app.broadcast.emit('server_message', action)
}

export default connect
