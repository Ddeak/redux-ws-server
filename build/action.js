'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customAction = exports.actions = undefined;

var _humps = require('humps');

var _humps2 = _interopRequireDefault(_humps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var actions = {
  connect: function connect(data, app) {
    return {
      types: types,
      type: 'API_CONNECT',
      app: app,
      data: data
    };
  },
  response: function response(_ref, data) {
    var types = _ref.types,
        type = _ref.type;

    var responseType;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(types)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (types[key] == type) {
          responseType = types[key + 'Response'] = type + '_RESPONSE';
          break;
        }
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

    return {
      types: types,
      type: responseType,
      local: true,
      data: data
    };
  }
};

var customAction = function customAction(typeName, data, app) {
  var typeValue = _humps2.default.decamelize(typeName).toUpperCase();
  var action = {
    types: _defineProperty({}, typeName, typeValue),
    type: typeValue,
    app: app,
    data: data
  };
  return action;
};

exports.actions = actions;
exports.customAction = customAction;