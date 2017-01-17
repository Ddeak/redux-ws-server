'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _action = require('./action');

var _stackSaml = require('@gp-technical/stack-saml');

var saml = _interopRequireWildcard(_stackSaml);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io;

var connect = function connect(services, httpServer) {
  return new Promise(function (resolve) {
    io = new _socket2.default(httpServer).use(saml.socketMiddleware).on('connection', function (app) {
      dispatch(_action.actions.connect(app.request.user, app.id));

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var current = _step.value;

          if (!services[current].initialiser) return 'continue';

          services[current].initialiser().then(function (results) {
            dispatch((0, _action.customAction)(current + '_init', results, app.id));
          });
        };

        for (var _iterator = Object.keys(services)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

          if (_ret === 'continue') continue;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      app.on('client_message', function (action, next) {
        if (!action.app) action.app = app.id;
        for (var key in services) {
          var processor = services[key].processor;
          if (!processor) continue;
          processor(action, next, function (data) {
            return broadcastOthers(app, _action.actions.response(action, data));
          });
        }
      });
    });
    resolve(io);
  });
};

var dispatch = function dispatch(action) {
  if (!action.app) {
    console.error('Error: the action being dispatch from the API has no App property.');
    return;
  }

  action.fromApi = true;
  io.to(action.app).emit('server_message', action);
};

var broadcastOthers = function broadcastOthers(app, action) {
  action.fromApi = true;
  app.broadcast.emit('server_message', action);
};

exports.default = connect;